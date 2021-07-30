const {cyan} = require('./JSON/colours.json');
const {MessageEmbed, Message} = require('discord.js');

const {AGREE, DISAGREE} = require('./config');


class Embed extends MessageEmbed {
  constructor(message) {
    super()

    this.message = message

    this.baseEmbed()
  }

  setPrimary(description = ''){
    this.setColor(cyan)
    this.setDescription(description)

    return this
  }

  setSecondary(description = ''){
    this.setColor(cyan)
    this.setDescription(description)

    return this
  }

  setError(description = '') {
    this.setColor(cyan)
    this.setDescription(`${DISAGREE} ` + description)

    return this
  }

  setSuccess(description = ''){
    this.setColor(cyan)
    this.setDescription(`${AGREE} ` + description)

    return this
  }

  send(channel = this.message.channel, description) {
    if (description) {
      return channel.send(description, {
        embed: this
      })
    }

    return channel.send(this)
  }

  baseEmbed() {
    this.setAuthor(this.message.author.username, this.message.author.displayAvatarURL())
    this.setTimestamp()

    return this
  }
}

function embed(message) {
  return new Embed(message)
}

module.exports = embed
