const db = require("quick.db");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const ms = require('ms');

module.exports = {
  config: {
    name: "магазин",
    description: "Магазин бота.",
    category: "c_economy",
    aliases: ["shop", "store", "магаз", 'шоп'],
    accessableby: "Для всех",
    usage: ""
  },
  run: async (bot, message, args) => {
      let embed = new MessageEmbed()
      .setColor(cyan)
      .setAuthor("Обратите внимание, VIP можно получить за донат.")
      .addFields(
        {name: `<a:vip1:867868958877810748> VIP 1   \`\`?купить [vip-1 или VIP-1]\`\``,
        value: `1.000 ${STAR}`,
        inline: false},
        {name: `<a:vip2:867868958459166751> VIP 2   \`\`?купить [vip-2 или VIP-2]\`\``,
        value: `10.000 ${STAR}`,
        inline: false},
        {name: `Покупка звёзд:   \`\`?купить [звезды или stars] <кол-во>\`\``,
        value: `100.000 ${COIN} = 1 ${STAR}`,
        inline: false}
      )
      .setTimestamp()
      .setFooter("Dann#0006")

      message.channel.send(embed)
  }
}
