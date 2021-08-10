const db = require("quick.db");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const ms = require('ms');

module.exports = {
  config: {
    name: "донат",
    description: "Поддерживать разработчика, и купить премиум доступ.",
    category: "c_economy",
    aliases: ["donate"],
    accessableby: "Для всех",
    usage: ""
  },
  run: async (bot, message, args) => {
      let embed = new MessageEmbed()
      .setColor(cyan)
      .addFields(
        {name: `Поддерживать разработчика, и купить премиум доступ.`,
        value: '**[Ссылка на донат](https://www.donationalerts.com/r/danndevbot)**',
        inline: false},
        {name: `Всё, что нужно указать!`,
        value: '• Ваш ID\n• Что именно вы хотите, например **Vip 1** или **Vip 2**.',
        inline: false},
        {name: `Цены в рублях.`,
        value: `• Vip 1 + 300.000 ${COIN} - 30₽\n• Vip 2 + 500.000 ${COIN} - 100₽\n• Zeus (Зевс) - 200₽`,
        inline: false},
      )
      .setTimestamp()
      .setFooter("Отправьте ваши вопросы командой ?сообщение")

      message.channel.send(embed)
  }
}
