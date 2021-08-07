const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
let ownerID = '382906068319076372';
let dariusID = '873237782825422968';
const { COIN, BANK } = require('../../config');
const profileModel = require("../../models/profileSchema");

module.exports = {
  config: {
    name: "убрать",
    description: "Убрать кол-во денег от участника.",
    category: "owner",
    aliases: ["rmoney", "remove-money", "уб"],
    accessableby: "Для разработчика.",
    usage: "[никнейм участника | упоминание | ID] [кол-во монет] "
  },
  run: async (bot, message, args) => {
     if(message.member.user.id !== ownerID && message.member.user.id !== dariusID) return embed(message).setError("К сожалению вы не разработчик.").send().then(msg => {msg.delete({timeout: "10000"})});
    if (!args[0]) return embed(message).setError("Укажите участника.").send().then(msg => {msg.delete({timeout: "10000"})});

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    if(!args[1]) return embed(message).setError("Укажите кол-во монет, чтобы убрать.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(isNaN(args[1])) return embed(message).setError("Укажите кол-во монет в виде, чтобы убрать.").send().then(msg => {msg.delete({timeout: "10000"})});
    let profileData = await profileModel.findOne({ userID: user.id });

    await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(-args[1])}});

    embed(message).setPrimary(`Изменение баланса: Удаление <@${user.id}>\n\nУбрано: ${COIN}**${Math.floor(args[1])}**`).send();
  }
}
