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
// File: mountainz.js
// Purpose: Initial sequence of the Mountainz#2500 bot.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
// This Source Code Form is "Incompatible With Secondary Licenses", as
// defined by the Mozilla Public License, v. 2.0.

// \\
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// External Modules (alphabetical order) \\

/* eslint-disable indent */
const Discord = require('discord.js')
const client = new Discord.Client({disabledEvents: ['GUILD_MEMBER_UPDATE', 'GUILD_SYNC', 'TYPING_START']})
const Elliot = require('../assets/elliot')
const Express = require('express')
  const app = Express()
const fs = require('fs')
const https = require('https')
const Robert = require('../assets/robert')
const requestSync = require('sync-request')
/* eslint-enable indent */

// \\
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// (Global) Deleclarations \\

client.commands = new Discord.Collection()
client.services = new Discord.Collection()
const serviceExports = {client, app}
const categories = ['admin', 'lookup', 'misc', 'music']
const settings = JSON.parse(requestSync('GET', process.env.settingsJSON).getBody('utf8'))

// \\
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// Heroku Init \\

app.set('port', (process.env.PORT || 2500))

app.get('/', function (request, response) {
  response.send(`
    <head> <meta http-equiv="refresh" content="0; url=https://kalissaac.github.io/mountainz" /> </head>
    You're in the wrong place! Go here: <a href="https://kalissaac.github.io/mountainz">https://kalissaac.github.io/mountainz</a>
  `)
}).listen(app.get('port'), function () {
  console.log(`Hey Norman, we got uptime! Actively porting on ${app.get('port')}`)
})

setInterval(function () {
  if (settings.nightPing === true) {
    https.get('https://mountainz.herokuapp.com')
  } else {
    const currentHour = new Date().getUTCHours()
    if (currentHour >= 13 && currentHour <= 22) {
      https.get('https://mountainz.herokuapp.com')
    }
  }
}, 5 * 60 * 1000) // 5 minutes in milliseconds

// \\
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// Initial Discord Listeners \\

client.on('ready', () => {
  console.log('Ready the hounds, Mountainz is good for operation!')
  client.user.setStatus('dnd')
  client.user.setGame('initializing...')
  runServices()
  loadCommands()
  client.user.setStatus('online')
  client.user.setGame('what we want. | *help')
})

client.on('message', message => {
  if (message.author.id === client.user.id) return
  if (message.content.startsWith('**')) return
  if (message.content.startsWith('*')) processCommand(message)
})

// \\
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// Core Commands \\

/* command format

client.commands.set('name', {
  category: '',
  description: 'Sentence (or two) description of what command does.',
  enabled: true, // whether the command should be loaded
  name: 'name',
  process: function (bot, message, args) {
    console.log(args)
    // TODO: code.
  },
  restricted: false, // whether the command should show up in the general information commands. -if true it will NOT show up, and vise versa.
  usage: '' // example of types of arguments for command
}

*/

client.commands.set('about', {
  category: 'misc',
  description: 'Gives general information about Mountainz#2500.',
  enabled: true,
  process: function (bot, message, args) {
    if (message.guild) message.reply('Check your direct messages!')
    message.author.send(new Discord.Attachment('./assets/mountainz.png'))
  },
  restricted: false,
  usage: ''
})

client.commands.set('report', {
  category: 'misc',
  description: 'Invokes bug reporter wizard.',
  enabled: true,
  process: function (bot, message, args) {
    message.reply('Thanks for your interest in Mountainz! In order to report bugs, we ask that you visit the reporting wizard at https://kalissaac.github.io/mountainz/report')
  },
  restricted: false,
  usage: ''
})

client.commands.set('shutdown', {
  category: 'admin',
  description: 'Shuts down the bot.',
  enabled: true,
  process: function (bot, message, args) {
    if (message.author.id !== '233760849381163010') return
    let elliotLog = new Elliot.Log(true)
    elliotLog.init('Mountainz Shutdown', message.author.tag)
      .then(() => bot.destroy().then(() => process.exit(0)))
  },
  restricted: true,
  usage: ''
})

/* eslint-disable brace-style */
async function processCommand (message) {
  const content = message.content
  const commandName = content.split(' ')[0].substring(1).toLowerCase()
  const commandArguments = content.substring(commandName.length + 2)

  if (commandName === 'help') {
    if (commandArguments && client.commands.has(commandArguments)) {
      const helpcmd = client.commands.get(commandArguments)
      if (helpcmd.restricted === false) {
        message.author.send(new Discord.Attachment(`./assets/help/help-${helpcmd.category}.png`))
        if (message.guild) message.reply('Check your direct messages!').then(msg => msg.delete(5000))
      }
    } else {
      message.author.send(new Discord.Attachment('./assets/help/help.png')).then(() => {
        for (var i = 0; i < categories.length; i++) {
          if (categories[i] !== 'admin' || categories[i] !== 'misc') message.author.send(new Discord.Attachment(`./assets/help/help-${categories[i]}.png`))
        }
        if (message.guild) message.reply('Check your direct messages!').then(msg => msg.delete(5000))
      })
    }
  }

  else if (client.commands.has(commandName)) {
    const commandData = client.commands.get(commandName)
    try {
      commandData.process(client, message, commandArguments)
      let elliotLog = new Elliot.Log()
      elliotLog.init('Command Run')
      elliotLog.addField(content, message.author.tag)
      elliotLog.send()
    } catch (e) {
      console.error(`Eh laddie, looks like you messed up with the *${commandName}, huh? Looks like we got a ${e}`)
      let elliotError = new Elliot.Log()
      elliotError.init('Command Error')
      elliotError.addField(`*${commandName}`, e)
      elliotError.send()
    }
  }

  else message.reply(`${commandName} not recognized as a command!`).then(msg => msg.delete(5000))
  console.log(client.commands)
}
/* eslint-enable brace-style */

// \\
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// Load Commands and Services \\

function runServices () {
  for (const file of fs.readdirSync('./src/services/')) {
    const service = require(`./services/${file}`)
    if (service.enabled === true) client.services.set(service.name, service)
  }
  client.services.forEach(service => service.process(serviceExports))
}

function loadCommands () {
  for (const folder of fs.readdirSync('./src/commands/')) {
    if (folder !== '.DS_Store') {
      for (const file of fs.readdirSync(`./src/commands/${folder}`)) {
        console.log(file)
        const command = require(`./commands/${folder}/${file}`)
        if (command.enabled === true) client.commands.set(command.name, command)
      }
    }
  }
}

// TODO: Actually write stuff

// \\
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// Cleanup and Formalities \\
client.login(settings.botToken)
