const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");


module.exports = {
  config: {
    name: "канал",
    description: "Отправлять сообщение на указанном канале.",
    category: "g_vip",
    aliases: ["channel"],
    accessableby: "Нужна права: Администратор.",
    usage: "[упоминание канала] [ваше сообщение]"
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

    let channel = message.mentions.channels.first();
    if(bag["vip1"] === false) return message.channel.send(embed.setDescription("❌ Эта команда доступна только для **VIP 1** пользователей.")).then(msg => {msg.delete({timeout: "10000"})});

    let arg = args.slice(1).join(" ")
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
    if(!args[0]) return message.channel.send(embed.setDescription("❌ Укажите #текстовый канал.")).then(msg => {msg.delete({timeout: "10000"})});
    if(!arg) return message.channel.send(embed.setDescription("❌ Укажите текст.")).then(msg => {msg.delete({timeout: "10000"})});
    if(!channel) return message.channel.send(embed.setDescription("❌ Укажите доступный #текстовый канал.")).then(msg => {msg.delete({timeout: "10000"})});


    channel.send(arg)


  }
}
