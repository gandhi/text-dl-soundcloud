# SoundCloud Downloader w/ Twilio and Dropbox

This is super hacky.

By the end of this README, you will have a phone number that when texted a SoundCloud track link will download the song directly to your Dropbox.

1. Clone this repository into some web server that has Node.js installed.
2. Get an access token from [Dropbox](https://www.dropbox.com/developers/apps).
3. Create a number (or use an existing one) with [Twilio](https://www.twilio.com/console). 
4. Create a `config.js` file in the root of your project that looks like:
```js
module.exports = {
    access: {{Dropbox access token}},
    phone: {{Your phone number of the form '+13334445555'}}
}
```
5. Create a `music/` directory in the root of this project. Leave it empty.
6. Create a `music/` directory in your Dropbox's root.
7. Run `pip install soundscrape` in the server.
8. Get the IP of your web server that the project is going to live in. Go to your Twilio console and edit the 'Messaging' settings of the phone number.
![Imgur](http://i.imgur.com/38HjufW.png)
9. Run `sudo npm install pm2 -g`
10. `pm2 start index.js`

Now, whenever you text that phone number a link of a SoundCloud song, it will be downloaded. 

![Imgur](http://i.imgur.com/WBpyfIm.gif)