const db = require("quick.db");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const ms = require('ms');

module.exports = {
  config: {
    name: "магазин",
    description: "Магазин ролей сервера.",
    category: "c_economy",
    aliases: ["shop", "store", "магаз"],
    accessableby: "Для всех",
    usage: ""
  },
  run: async (bot, message, args) => {
      let embed = new MessageEmbed()
      .setColor(cyan)

      message.channel.send(embed.setDescription("Скоро будет!"))
  }
}
