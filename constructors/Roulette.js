const UserModel = require("../models/profileSchema")
const {cyan} = require('../JSON/colours.json');
const embed = require('../embedConstructor');
const {MessageEmbed} = require("discord.js");

const types = ['1-12', '13-24', '25-32']

class Roulette {
  constructor() {
    this.game = {
      users: [],
      channel: null
    }
  }

  addUser = (user, choose, value, channel) => {
    if (this.game.users.find(r => r.id === user)) return false

    if (!this.game.channel) {
      this.startGame()
      this.game.channel = channel
    }

    this.game.users.push({
      id: user,
      choose,
      value
    })
  }

  startGame() {
    setTimeout(() => {
      const type = this.randomChoose()

      const winners = this.game.users.filter(r => r.choose === type.type)

      winners.map(async winner => {
        await UserModel.updateOne({ userID: winner.id }, {
          $inc: { coins: winner.value * 3 }
        })
      })

      let Embed = new MessageEmbed()
      .setColor(cyan)
      .setDescription(`
Выпало число: **${type.number}**

${winners.length > 0 ?
`Победители:
${winners.map(r => `<@${r.id}> - ${r.value * 3}`).join('\n')}` : 'Победители: Нет'}`)

          this.game.channel.send(Embed)

      this.stopGame()
    }, 30 * 1000)
  }

  stopGame() {
    this.game = {
      users: [],
      channel: null
    }
  }

  randomChoose() {
    let number = Math.floor(Math.random() * 32)
    let type = null

    if (number === 0) number++

    if (number >= 1 && number <= 12) type = types[0]
    if (number >= 13 && number <= 24) type = types[1]
    if (number >= 25 && number <= 32) type = types[2]

    return {type, number}
  }
}

module.exports = new Roulette()
