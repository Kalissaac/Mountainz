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
// File: verify.js
// Purpose: Verification service.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
// This Source Code Form is "Incompatible With Secondary Licenses", as
// defined by the Mozilla Public License, v. 2.0.

const CryptoJS = require('crypto-js')
const Discord = require('discord.js')
const firebase = require('firebase')
const requestSync = require('sync-request')
const settings = JSON.parse(requestSync('GET', process.env.settingsJSON).getBody('utf8'))

module.exports = {
  name: 'verify',
  description: 'Verification service for guilds.',
  enabled: true,
  process: async function (serviceExports) {
    const client = serviceExports.client
    const app = serviceExports.app

    firebase.initializeApp(settings.firebaseConfig)

    client.on('guildMemberAdd', member => {
      firebase.database().ref('hsrr/guild/' + member.guild.id).once('value').then(function (snapshot) {
        if (!snapshot.val()) return
        firebase.database().ref('hsrr/id/' + member.id).once('value').then(function (snapshot) {
          if (!snapshot.val()) member.send(`https://kalissaac.github.io/mountainz/verfico/user?status=add&id=${CryptoJS.AES.encrypt(member.id, 'secret key 123')}`, new Discord.Attachment('./assets/verfico.png'))
          else if (snapshot.val().blacklist === true) member.kick('Blacklisted from Mountainz.')
          else updateMemberRoles(member)
        })
      })
    })

    client.on('message', message => {
      if (!message.guild && message.author.id === '233760849381163010' && message.content === '*updateAllRoles') {
        client.guilds.forEach(guild => {
          firebase.database().ref('hsrr/guild/' + guild.id).once('value').then(function (guildSnapshot) {
            if (!guildSnapshot.val()) return
            guild.members.forEach(member => {
              firebase.database().ref('hsrr/id/' + member.id).once('value').then(function (memberSnapshot) {
                if (!memberSnapshot.val() && member.user.bot === false) member.send(`https://kalissaac.github.io/mountainz/verfico/user?status=add&id=${CryptoJS.AES.encrypt(member.id, 'secret key 123')}`, new Discord.Attachment('./assets/verfico.png'))
                member.guild.roles.findAll('name', guildSnapshot.val().approvedRole).forEach(role => member.addRole(role).catch(console.error))
              })
            })
          })
        })
      }
    })

    app.get('/verify', function (request, response) {
      if (request.query.refresh === 'true') updateAllRoles(client)
      response.send('Thanks. It\'s not healthy to leave a request unresponded to.')
    })
  },
  restricted: false
}

function updateMemberRoles (member) {
  firebase.database().ref('hsrr/guild/' + member.guild.id).once('value').then(function (snapshot) {
    member.guild.roles.findAll('name', snapshot.val().approvedRole).forEach(role => member.addRole(role).catch(console.error))
  })
}

function updateAllRoles (client) {
  client.guilds.forEach(guild => {
    firebase.database().ref('hsrr/guild/' + guild.id).once('value').then(function (guildSnapshot) {
      if (guildSnapshot.val()) {
        guild.members.forEach(member => {
          firebase.database().ref('hsrr/id/' + member.id).once('value').then(function (memberSnapshot) {
            if (memberSnapshot.val()) {
              member.guild.roles.findAll('name', guildSnapshot.val().approvedRole).forEach(role => member.addRole(role).catch(console.error))
            }
          })
        })
      }
    })
  })
}

// verify module

// firebase.initializeApp(settings['firebase_config'])

// client.on('guildMemberAdd', member => {
//   firebase.database().ref('hsrr/guild/' + member.guild.id).once('value').then(function (snapshot) {
//     if (snapshot.val()) {
//       firebase.database().ref('hsrr/id/' + member.id).once('value').then(function (snapshot) {
//         if (!snapshot.val()) { // not registered
//           member.send('Welcome to the server! \n Before you begin to participate, we ask that you verify that you\'re a human. All you gotta do is just go to https://kalissaac.github.io/verify/?id=' + CryptoJS.AES.encrypt(member.id, 'secret key 123'))
//         } else if (snapshot.val().blacklist === true) {
//           member.kick('Blacklisted from Mountainz.')
//         } else {
//           firebase.database().ref('hsrr/guild/' + member.guild.id).once('value').then(function (snapshot) {
//             var roles = member.guild.roles.findAll('name', snapshot.val().approvedRole)
//             for (var i = 0; i < roles.length; i++) {
//               member.addRole(roles[i])
//             }
//           })
//         }
//       })
//     }
//   })
// })
