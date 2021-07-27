const profileModel = require("../../models/profileSchema");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN } = require('../../config');
let ownerID = '382906068319076372';


module.exports = {
  config: {
    name: "gift_by_id",
    description: "",
    category: "",
    aliases: "",
    accessableby: "Для разработчика.",
    usage: "[ID] [кол-во монет] "
  },
  run: async (bot, message, args) => {


     let addEmbed = new MessageEmbed()
     .setColor(redlight)
     .setTimestamp()
     .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

     if(message.member.user.id !== ownerID) return message.channel.send(addEmbed.setDescription("❌ К сожалению вы не разработчик.")).then(msg => {msg.delete({timeout: "10000"})});
    if (!args[0]) return message.channel.send(addEmbed.setDescription("❌ Укажите участника.")).then(msg => {msg.delete({timeout: "10000"})});

    let user = bot.users.cache.get(args[0]);
    try {
      let profileData = await profileModel.findOne({ userID: user.id });
    } catch {
      return message.channel.send(addEmbed.setDescription("❌ Данные не найдены.")).then(msg => {msg.delete({timeout: "10000"})});
    }

    if(!args[1]) return message.channel.send(addEmbed.setDescription("❌ Укажите кол-во монет, чтобы добавить.")).then(msg => {msg.delete({timeout: "10000"})});
    if(isNaN(args[1])) return message.channel.send(addEmbed.setDescription("❌ Укажите кол-во монет в виде, чтобы добавить.")).then(msg => {msg.delete({timeout: "10000"})});
    if(args[1] > 1000000000) return message.channel.send(addEmbed.setDescription("❌ Укажите число меньше **1.000.000.000**.")).then(msg => {msg.delete({timeout: "10000"})});
    if(args[1] < 10) return message.channel.send(addEmbed.setDescription("❌ Укажите число больше **10**.")).then(msg => {msg.delete({timeout: "10000"})});

    await profileModel.findOneAndUpdate({userID: user.id},{$inc: {bank: Math.floor(args[1])}});

    let sEmbed = new MessageEmbed()
    .setColor(greenlight)
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

    user.send(sEmbed.setDescription(`**У вас подарок от разработчика!🎉**\n||**${Math.floor(args[1])}** ${COIN}||`))


  }
}
