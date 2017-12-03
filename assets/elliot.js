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
// File: elliot.js
// Purpose: One and only status technician and sole employee of Mountainz#2500.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
// This Source Code Form is "Incompatible With Secondary Licenses", as
// defined by the Mozilla Public License, v. 2.0.

// \\
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// (Global) Deleclarations \\
const requestSync = require('sync-request')
const settings = JSON.parse(requestSync('GET', process.env.settingsJSON).getBody('utf8'))

// \\
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// External Modules (alphabetical order) \\

/* eslint-disable indent */
const Discord = require('discord.js')
  const webhookClient = new Discord.WebhookClient(settings['errorWebhook'][0], settings['errorWebhook'][1])
/* eslint-enable indent */

// \\
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// External Modules (alphabetical order) \\

class BaseElliot {
  /**
   * Foundation of Elliot
   * @param {boolean} sendOnInit
   */
  constructor (sendOnInit) {
    this._embed = new Discord.RichEmbed()
    this._embed.setTimestamp(new Date())
    this.init = async function (title, body) {
      if (body) {
        this._embed.setAuthor(title)
        this._embed.setDescription(body)
      } else this._embed.setAuthor(title)
      if (sendOnInit) return this.send()
    }
    this.addField = function (title, body, inline) {
      if (inline) {
        this._embed.addField(title, body, inline)
      } else this._embed.addField(title, body)
    }
    this.send = async function () {
      return new Promise((resolve, reject) => {
        webhookClient.send(this._embed)
          .then(message => resolve(message))
          .catch(err => reject(err))
      })
    }
  }
}

class ElliotError extends BaseElliot {
  /**
   * Instance of an Elliot error
   * @param {boolean} sendOnInit
   */
  constructor (sendOnInit) {
    super(sendOnInit)
    this._embed.setColor('RED')
  }
}

class ElliotLog extends BaseElliot {
  /**
   * Instance of an Elliot log
   * @param {boolean} sendOnInit
   */
  constructor (sendOnInit) {
    super(sendOnInit)
    this._embed.setColor('LIGHT_GREY')
  }
}

// \\
// \\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// Elliot Exports (alphabetical order) \\
module.exports = {
  Error: ElliotError,
  Log: ElliotLog
}
