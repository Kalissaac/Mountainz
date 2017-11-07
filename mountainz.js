// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
//         __            ___             __
//   |\/| /  \ |  | |\ |  |   /\  | |\ |  /
//   |  | \__/ \__/ | \|  |  /~~\ | | \| /_
//
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
//
// File: index.js
// Purpose: Initial sequence of the Mountainz#2500 bot.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
// This Source Code Form is "Incompatible With Secondary Licenses", as
// defined by the Mozilla Public License, v. 2.0.

// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// External Modules (alphabetical order) \\

const Discord = require('discord.js')
/**/const client = new Discord.Client({disabledEvents: ['TYPING_START']})
const Express = require('express')
/**/const app = Express()
const http = require('http')
const requestSync = require('sync-request')

//
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// (Global) Deleclarations \\

var commands = {}
var categories = ['admin', 'lookup', 'misc', 'music']
const settings = JSON.parse(requestSync('GET', process.env.settingsJSON).getBody('utf8'))
const elliot = new Discord.WebhookClient(settings['errorWebhook'][0], settings['errorWebhook'][1])

//
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// Heroku Init \\

app.set('port', (process.env.PORT || 2500))

app.get('/', function (request, response) {
  response.send('You\'re in the wrong place! Go here: <a href="https://kalissaac.github.io/mountainz.html">https://kalissaac.github.io/mountainz.html</a>')
}).listen(app.get('port'), function () {
  console.log('Hey Norman, we got uptime! Actively porting on ' + app.get('port'))
})

setInterval(function () {
  http.get('http://mountainz.herokuapp.com')
}, 5 * 60000)

//
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// core commands \\

/* command format

commands['name'] = {
  description: 'Sentence (or two) description of what command does.',
  enabled: true, // whether the command should be loaded -if true it WILL load, and vise versa.
  process: function (bot, message, suffix) {
    // actual code with message being the entire command including prefix and suffix being just the arguments
  },
  restricted: false, // whether the command should show up in the help command. -if true it will NOT show up, and vise versa.
  usage: '' // example of types of arguments for command
}

*/

commands['run'] = {
  category: 'admin',
  description: 'Executes arbitrary JavaScript in the bot process.',
  enabled: true,
  process: function (bot, message, suffix) {
    if (message.author.id !== '233760849381163010') { return }
    if (suffix) {
      console.log('execute')
    } else {
      message.reply('what code do you want me to execute?')
    }
  },
  restricted: true,
  usage: '<code>'
}

commands['shutdown'] = {
  category: 'admin',
  description: 'Shuts down the bot.',
  enabled: true,
  process: function (bot, message, suffix) {
    if (message.author.id !== '233760849381163010') return
    var elliotEmbed = new Discord.RichEmbed({timestamp: new Date()})
    elliotEmbed.setAuthor('Shutdown Log')
    elliotEmbed.addField('User', message.author.username)
    elliot.send('', elliotEmbed)
    bot.destroy().then(function () {
      process.exit('Bot shutdown.')
    })
  },
  restricted: true,
  usage: ''
}

commands['report'] = {
  category: 'misc',
  description: 'Invokes bug reporter wizard.',
  enabled: true,
  process: function (bot, message, suffix) {
    message.reply('thanks for your interest in Mountainz! In order to report bugs, we ask that you visit the reporting wizard at https://kalissaac.github.io/mountainz/report/')
  },
  restricted: false,
  usage: ''
}

// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// main discord listeners \\

client.on('ready', () => {
  console.log('Ready the hounds, Mountainz is good for operation!')
  // require('./commands.js').init()
  client.user.setGame('updating.')
  // client.user.setGame('what we want. | *help')
})

client.on('message', message => {
  if (message.content.startsWith('**')) return
  if (message.content.startsWith('***')) return
  if (message.author.id !== client.user.id && message.content.startsWith('*')) {
    message.reply(client.user + ' is not accepting commands at this time. Please check back later.')
  }
})

function processCommand (message) {
  var cmdTxt = message.content.split(' ')[0].substring(1)
  var suffix = message.content.substring(cmdTxt.length + 2)
  var cmd = commands[cmdTxt]
  if (cmdTxt === 'help') {
    if (suffix) { // help for specific command
      var helpcmd = commands[suffix]
      if (helpcmd && helpcmd.restricted === false) {
        message.author.send(new Discord.Attachment('./assets/help/help-' + helpcmd.category + '.png'))
        message.reply('check your direct messages!').then(msg => msg.delete(5000))
      } else {
        message.reply(suffix + ' not recognized as a command!')
      }
    } else { // help for general usage
      message.author.send(new Discord.Attachment('./assets/help/help.png')).then(function () {
        for (var i = 0; i < categories.length; i++) {
          if (categories[i] !== 'admin') {
            message.author.send(new Discord.Attachment('./assets/help/help-' + categories[i] + '.png'))
          }
        }
        message.reply('check your direct messages!').then(msg => msg.delete(5000))
      })
    }
  } else if (cmd) {
    try {
      cmd.process(client, message, suffix)
    } catch (e) {
      console.log('Eh laddie, looks like you messed up with the *' + cmdTxt + ', huh? Looks like a ' + e)
      var elliotEmbed = new Discord.RichEmbed({timestamp: new Date()})
      elliotEmbed.setAuthor('Command Error')
      elliotEmbed.addField('*' + cmdTxt, e)
      elliot.send('', elliotEmbed)
    }
  } else {
    message.channel.reply(cmdTxt + ' not recognized as a command!').then(msg => msg.delete(5000))
  }
}

exports.addCommand = function (commandName, payload) {
  try {
    if (payload.enabled === true) {
      commands[commandName] = payload
    }
  } catch (err) {
    console.log('Well, well, well. What command load error do we have here? ' + err)
  }
}

//
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// Load Commands and Services \\

// TODO: Actually write stuff

// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// Cleanup and Formalities \\
client.login(settings['botToken'])
