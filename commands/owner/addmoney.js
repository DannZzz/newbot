const profileModel = require("../../profileSchema");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN } = require('../../config');
let ownerID = '382906068319076372';
let dariusID = '803618695687307264';

module.exports = {
  config: {
    name: "добавить",
    description: "Добавить кол-во денег участнику.",
    category: "owner",
    aliases: ["addm", "addmoney", "доб"],
    accessableby: "Для разработчика.",
    usage: "[никнейм участника | упоминание | ID] [кол-во монет] "
  },
  run: async (bot, message, args) => {
     let addEmbed = new MessageEmbed()
     .setColor(redlight)
     .setTimestamp()
     .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

     if(message.member.user.id !== ownerID && message.member.user.id !== dariusID) return message.channel.send(addEmbed.setDescription("❌ К сожалению вы не разработчик.")).then(msg => {msg.delete({timeout: "10000"})});
    if (!args[0]) return message.channel.send(addEmbed.setDescription("❌ Укажите участника.")).then(msg => {msg.delete({timeout: "10000"})});

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    let profileData = await profileModel.findOne({ userID: user.id });

    if(!args[1]) return message.channel.send(addEmbed.setDescription("❌ Укажите кол-во монет, чтобы добавить.")).then(msg => {msg.delete({timeout: "10000"})});
    if(isNaN(args[1])) return message.channel.send(addEmbed.setDescription("❌ Укажите кол-во монет в виде, чтобы добавить.")).then(msg => {msg.delete({timeout: "10000"})});
    if(args[1] > 1000000000) return message.channel.send(addEmbed.setDescription("❌ Укажите число меньше **1.000.000.000**.")).then(msg => {msg.delete({timeout: "10000"})});
    if(args[1] < 10) return message.channel.send(addEmbed.setDescription("❌ Укажите число больше **10**.")).then(msg => {msg.delete({timeout: "10000"})});


    await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(args[1])}});



    let sEmbed = new MessageEmbed()
    .setColor(greenlight)
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

    message.channel.send(sEmbed.setDescription(`Изменение баланса: Добавление <@${user.id}>\n\nДобавлено: ${COIN}**${Math.floor(args[1])}**`));
  }
}
