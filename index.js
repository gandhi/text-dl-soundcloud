var express = require('express');
var bodyParser = require('body-parser');
var Dropbox = require('dropbox');
const fs = require('fs');
var path = require('path');

var exec = require('child_process').exec;
var config = require('./config');

var PORT = 3000;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

var dbx = new Dropbox({ accessToken: config.access });

app.post("/message", function(req, res) {
    console.log('Message!');
    if (req.body.From != config.phone) return;
    var link = req.body.Body;
    console.log('Link: ' + link);
    exec('cd music && soundscrape -d ' + link, function callback(error, stdout, stderr) {
        if (stdout.indexOf('Skipping:') > -1) {
            console.log('Must get LQ version');
            exec('cd music && soundscrape ' + link, function callback(error, stdout, stderr) {
                console.log(stdout);
                uploadFiles();
                return res.send("<Response><Message>Downloaded LQ Version.</Message></Response>")
            })
        } else {
            // We found HQ version!
            console.log('We found HQ version!');
            uploadFiles();
            return res.send("<Response><Message>Downloaded HQ Version.</Message></Response>")
        }
    })
});

function uploadFiles() {
    console.log('Uploading files...');
    const testFolder = './music/';
    const file = fs.readdirSync(testFolder)[0];
    console.log('Found file: ' + file);
    fs.readFile(path.join(__dirname, testFolder + file), function(err, contents) {
        if (err) {
            console.log('Error: ', err);
        }
        var base64File = new Buffer(contents, 'binary').toString('base64');
        console.log('Coverted to music. Uploading to dropbox.');
        dbx.filesUpload({ path: '/music/' + file, contents: contents })
            .then(function(response) {
                console.log('Done uploading to dbx. Now to delete.');
                fs.unlinkSync(testFolder + file);
                console.log('Done deleting.');
            })
            .catch(function(err) {
                console.log(err);
            });
    });
}

var listener = app.listen(PORT, function() {
    console.log('Your app is listening on port ' + PORT);
});
