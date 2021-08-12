
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const ms = require('ms');

module.exports = {
  config: {
    name: "магазин",
    description: "Глобальный магазин бота.",
    category: "c_economy",
    aliases: ["shop", "store", "магаз", 'шоп'],
    accessableby: "Для всех",
    usage: ""
  },
  run: async (bot, message, args) => {
      let embed = new MessageEmbed()
      .setColor(cyan)
      .setAuthor("Вся информация о переводах: ?donate")
      .addFields(
        {name: `<a:vip1:867868958877810748> VIP 1`,
        value: `Увеличивает ставку для всех игр(до 1.000.000), доступ к командам - эмбед, канал, уровни(включение системы уровней), эскиз и био профиля, и так же увеличивает стоимость рыб(на 33%).`,
        inline: false},
        {name: `<a:vip2:867868958459166751> VIP 2`,
        value: `Даёт доступ к уникальным героям, уменьшает **cooldown** для всех команд **два** раза, даёт возможность оформить ранг-карточку, картинку профиля, а так же убирает ограничение ставок для всех игр.`,
        inline: false},

      )
      .setTimestamp()
      .setFooter("Отправьте ваши вопросы командой ?сообщение")

      message.channel.send(embed)
  }
}
