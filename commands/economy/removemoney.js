
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
let ownerID = '382906068319076372';
let dariusID = '803618695687307264';
const { COIN, BANK } = require('../../config');
const profileModel = require("../../profileSchema");

module.exports = {
  config: {
    name: "убрать",
    description: "Убрать кол-во денег от участника.",
    category: "economy",
    aliases: ["rmoney", "remove-money", "уб"],
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
    if(!args[1]) return message.channel.send(addEmbed.setDescription("❌ Укажите кол-во монет, чтобы убрать.")).then(msg => {msg.delete({timeout: "10000"})});
    if(isNaN(args[1])) return message.channel.send(addEmbed.setDescription("❌ Укажите кол-во монет в виде, чтобы убрать.")).then(msg => {msg.delete({timeout: "10000"})});
    let profileData = await profileModel.findOne({ userID: user.id });

    await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(-args[1])}});

    let sEmbed = new MessageEmbed()
    .setColor(greenlight)
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

    message.channel.send(sEmbed.setDescription(`Изменение баланса: Удаление <@${user.id}>\n\nУбрано: ${COIN}**${Math.floor(args[1])}**`));
  }
}
