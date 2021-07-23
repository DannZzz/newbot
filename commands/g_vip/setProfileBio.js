const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");


module.exports = {
  config: {
    name: "профиль-био",
    description: "Поставить био на свой профиль.",
    category: "g_vip",
    aliases: ["set-bio"],
    accessableby: "Для всех",
    usage: "[ваше сообщение]"
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

    let bag =await begModel.findOne({userID: message.author.id});


    if(bag['vip1'] === false) return message.channel.send(embed.setDescription("❌ Эта команда доступна только для **VIP 1** пользователей.")).then(msg => {msg.delete({timeout: "10000"})});
    let arg = args.slice(" ").join(" ")
    if(!args[0]) return message.channel.send(embed.setDescription("❌ Укажите текст.")).then(msg => {msg.delete({timeout: "10000"})});

    message.channel.send(sembed.setDescription('✅ Успешно установленo новoe био профиля.'))
    await vipModel.findOneAndUpdate({userID: message.author.id}, {$set: {profileBio: arg}})

  }
}
