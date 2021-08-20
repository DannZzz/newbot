const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../JSON/colours.json");
const {PREFIX, DEV, botINVITE} = require("../../config");
const moment = require('moment');

module.exports = {
  config: {
    name: "ботинфо",
    category: "b_info",
    aliases: ["бот", "bot", "botinfo"],
    description: "Выдает информацию о боте.",
    usage: "",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
  let botAvatar = bot.user.displayAvatarUrl;
  const embed = new MessageEmbed()

  .setAuthor('Информация о боте!')
  .addFields(
  { name: 'Название:', value: bot.user.tag },
  { name: "Создано в ", value: moment(bot.user.createdAt).format('DD.MM.YYYY HH:mm') } )
  .addField('Разработчик: ', DEV, true)
  .addField('Префикс по умолчанию: ', PREFIX, true)
  .addField('Чтобы приглашать меня нажми на:', `[ПРИГЛАШЕНИЕ](${botINVITE})`)
  .addField('Наш Дискорд сервер:', `[OnlyChill](https://discord.gg/OnlyChill)`)
  .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
  .setFooter("ID: " + bot.user.id)
  .setTimestamp()
  .setColor(cyan)

  message.channel.send({embeds: [embed]});
  }
}
