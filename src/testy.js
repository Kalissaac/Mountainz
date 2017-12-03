const Elliot = require('../assets/elliot')
const Discord = require('discord.js')

const settings = require('../assets/settings.json')
const elliot = new Discord.WebhookClient(settings['errorWebhook'][0], settings['errorWebhook'][1])

// let elliotEmbed = new Discord.RichEmbed({timestamp: new Date()})
// elliotEmbed.setAuthor('Mountainz Shutdown')
// elliotEmbed.setDescription('kally')
// elliot.send(elliotEmbed).then(() => {
//   console.warn('hu')
// })

const elliot2 = new Elliot.Log(true)
elliot2.init('john', 'bob')
  .then(msg => {
    console.log(msg)
    console.log(msg.id)
  })
  .catch(err => console.error(err))

const elliot3 = new Elliot.Error(false)
elliot3.init('ohh', 'looky')
// elliot3.send()
