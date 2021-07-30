const profileModel = require("../../models/profileSchema");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN } = require('../../config');
let ownerID = '382906068319076372';
let dariusID = '803618695687307264';
const embed = require('../../embedConstructor');

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

     if(message.member.user.id !== ownerID && message.member.user.id !== dariusID) return embed(message).setError("К сожалению вы не разработчик.").send().then(msg => {msg.delete({timeout: "10000"})});
    if (!args[0]) return embed(message).setError("Укажите участника.").send().then(msg => {msg.delete({timeout: "10000"})});

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    let profileData = await profileModel.findOne({ userID: user.id });

    if(!args[1]) return embed(message).setError("Укажите кол-во монет, чтобы добавить.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(isNaN(args[1])) return embed(message).setError("Укажите кол-во монет в виде, чтобы добавить.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(args[1] > 1000000000) return embed(message).setError("Укажите число меньше **1.000.000.000**.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(args[1] < 10) return embed(message).setError("Укажите число больше **10**.").send().then(msg => {msg.delete({timeout: "10000"})});


    await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(args[1])}});

    embed(message).setPrimary(`Изменение баланса: Добавление <@${user.id}>\n\nДобавлено: ${COIN}**${Math.floor(args[1])}**`).send();
  }
}
