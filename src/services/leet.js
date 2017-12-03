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
// File: leet.js
// Purpose: Converts all text to 1337.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
// This Source Code Form is "Incompatible With Secondary Licenses", as
// defined by the Mozilla Public License, v. 2.0.

module.exports = {
  description: 'Converts everything you say to 1337.',
  enabled: false,
  process: function (bot, message, suffix) {
    // actual code with message being the entire command including prefix and suffix being just the arguments
    // leetmode

    var leetmode = []

     bot.on('message', message => {
      if (message.author.id === bot.user.id) return;
      if (message.author.bot === true) return;
      if (!message.content.includes('*leet')) return;
      if (!message.guild) message.reply('leetmode is not available in DMs!'); return;
      console.log(0);
      var guilduser = message.guild.fetchMember(bot.user)
      console.log(1);
      if (guilduser.hasPermission('MANAGE_WEBHOOKS') === false || guilduser.hasPermission('MANAGE_MESSAGES') === false) message.reply('please make sure I have both the Manage Messages and Manage Webhooks permissions!'); return;
    console.log(2);
      if (message.content === '*leet on') {
        console.log('ye');
        var doit = true
        leetmode.forEach(function (item, index, array) {
          if (item == message.author.id) {
            doit = false;
            return;
          }
        });
        if (doit == true) {
          leetmode.push(message.author.id);
        }
      } else if (message.content === '*leet off') {
        leetmode.forEach(function (item, index, array) {
          if (item == message.author.id) {
            leetmode.splice(index, 1);
            return;
          }
        });
      }
      leetmode.forEach(function (item, index, array) {
        if (item == message.author.id) {
          var channelhook;
          message.channel.fetchWebhooks()
            .then(function(webhooks) {
              webhooks.forEach(function (item, index, map) {
                if (item.name == "leetmode") {
                  channelhook = item;
                }
              })
              if (!channelhook) {
                message.channel.createWebhook("leetmode", "https://cdn-images-1.medium.com/max/800/0*FDdiWdrriXPKGNyf.png")
                  .then(function(webhook) {
                    channelhook = webhook;
                  });
              }
              var content = message.content

              content = content.replace(/o/g, '0');
              content = content.replace(/O/g, '0');

              content = content.replace(/i/g, '1');
              content = content.replace(/I/g, '1');

              content = content.replace(/l/g, '1');
              content = content.replace(/L/g, '1');

              content = content.replace(/e/g, '3');
              content = content.replace(/E/g, '3');

              content = content.replace(/a/g, '4');
              content = content.replace(/A/g, '4');

              content = content.replace(/s/g, '5');
              content = content.replace(/S/g, '5');

              content = content.replace(/g/g, '9');
              content = content.replace(/G/g, '6');

              content = content.replace(/t/g, '7');
              content = content.replace(/T/g, '7');

              content = content.replace(/b/g, '8');
              content = content.replace(/B/g, '8');

              request.post("https://discordapp.com/api/webhooks/"+channelhook.id+"/"+channelhook.token).form({content:content, username:message.author.username, avatar_url:message.author.avatarURL})
              message.delete()
            })
        }
      });
    });
  },
  restricted: false,
  usage: '<on/off>'
}
