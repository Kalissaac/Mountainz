// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
//
//   /$$      /$$  /$$$$$$  /$$   /$$ /$$   /$$ /$$$$$$$$ /$$$$$$  /$$$$$$ /$$   /$$ /$$$$$$$$
//  | $$$    /$$$ /$$__  $$| $$  | $$| $$$ | $$|__  $$__//$$__  $$|_  $$_/| $$$ | $$|_____ $$
//  | $$$$  /$$$$| $$  \ $$| $$  | $$| $$$$| $$   | $$  | $$  \ $$  | $$  | $$$$| $$     /$$/
//  | $$ $$/$$ $$| $$  | $$| $$  | $$| $$ $$ $$   | $$  | $$$$$$$$  | $$  | $$ $$ $$    /$$/
//  | $$  $$$| $$| $$  | $$| $$  | $$| $$  $$$$   | $$  | $$__  $$  | $$  | $$  $$$$   /$$/
//  | $$\  $ | $$| $$  | $$| $$  | $$| $$\  $$$   | $$  | $$  | $$  | $$  | $$\  $$$  /$$/
//  | $$ \/  | $$|  $$$$$$/|  $$$$$$/| $$ \  $$   | $$  | $$  | $$ /$$$$$$| $$ \  $$ /$$$$$$$$
//  |__/     |__/ \______/  \______/ |__/  \__/   |__/  |__/  |__/|______/|__/  \__/|________/
//
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
//
// File: usaHelp.js
// Purpose: Service that replies when @help is mentioned in USA guild.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
// This Source Code Form is "Incompatible With Secondary Licenses", as
// defined by the Mozilla Public License, v. 2.0.

module.exports = {
  name: 'usaHelp',
  description: 'Replies when @help is mentioned in USA guild.',
  enabled: true,
  process: async function (serviceExports) {
    const client = serviceExports.client
    client.on('message', message => {
      if (message.guild && (message.guild.id === '284377337292652556' || message.guild.id === '350855731609600000')) {
        message.mentions.roles.forEach(function (role) {
          if (role.name === 'help') message.reply('Help is on the way! Give a brief description of what\'s going on.')
        })
      }
    })
  },
  restricted: false
}
