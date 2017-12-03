# Welcome to Mountainz

[![Status](https://img.shields.io/website-up-down-green-red/http/shields.io.svg?label=status&style=for-the-badge)](https://mountainz.herokuapp.com)

[![GitHub last commit](https://img.shields.io/github/last-commit/Kalissaac/Mountainz.svg?style=for-the-badge)](https://github.com/Kalissaac/Mountainz)
[![GitHub top language](https://img.shields.io/github/languages/top/Kalissaac/Mountainz.svg?style=for-the-badge)](https://github.com/Kalissaac/Mountainz)

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-yellow.svg?style=for-the-badge)](https://standardjs.com)
[![Discord API](https://img.shields.io/badge/api-discord.js-blue.svg?style=for-the-badge)](https://discord.js.org/)

### Installation:
0. Clone repository to local directory
1. Install dependencies (`npm install`)
2. Copy this example and fill it in:
``` json 
{
  "botToken": "Discord Bot OAuth2 Token (https://discordapp.com/developers/applications/me)",
  "nightPing": true,
  "firebaseConfig": {
    "apiKey": "Firebase API Key",
    "authDomain": "project.firebaseapp.com",
    "databaseURL": "https://project.firebaseio.com",
    "projectId": "project",
    "storageBucket": "project.appspot.com",
    "messagingSenderId": "Firebase Messaging Sender Id"
  },
  "errorWebhook": ["Discord Webhook Id", "Discord Webhook Token"]
} 
```
3. Save file to a cloud service like [myjson](http://myjson.com/) and supply link in src/mountainz.js
4. Run the bot (`npm start`) [You can also run `npm test` which lints and then runs nodemon]


### Dependencies:
- [discord.js](https://discord.js.org/): Discord API
- [firebase](https://firebase.google.com/): backend database
- [ffmpeg](https://ffmpeg.org/) & [node-opus](https://github.com/Rantanen/node-opus): playing audio

### Developer Dependencies:
- [nodemon](https://nodemon.io/): development testing
- [standard](https://standardjs.com/): code style and linter

### Contributions:
If you would like to add to anything, feel free to submit a pull request! You can contact me if you'd like on Discord at Kalissaac#8199

### License:
This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
