const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");


module.exports = {
  config: {
    name: "ранг-цвет",
    description: "Установить цвет для текста на ранг-карту.",
    category: "g_vip",
    aliases: ["rank-color"],
    accessableby: "Для всех",
    usage: "[цвет hex(#00ff00)]"
  },
  run: async (bot, message, args) => {
    let embed = new MessageEmbed()
      .setColor(redlight)
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))


    let sembed = new MessageEmbed()
       .setColor(greenlight)
       .setTimestamp()
       .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

    let bag = await begModel.findOne({userID: message.author.id});

    if(bag['vip1'] === false || bag['vip2'] === false) return message.channel.send(embed.setDescription("❌ Эта команда доступна только для **VIP 2** пользователей.")).then(msg => {msg.delete({timeout: "10000"})});

    if(!args[0]) return message.channel.send(embed.setDescription("❌ Укажите цвет.\nПример: \`\`#ff00ff или ff00ff\`\`")).then(msg => {msg.delete({timeout: "10000"})});

    message.channel.send(sembed.setDescription('✅ Успешно установлена новая картинка для ранг-карточки.\nОбратите внимание, что цвет указан правильно.'))
    await vipModel.findOneAndUpdate({userID: message.author.id}, {$set: {rankColor: args[0]}})

  }
}
