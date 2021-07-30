const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const profileModel = require("../../models/profileSchema");


module.exports = {
  config: {
    name: "перевести",
    description: "Перевести кол-во денег другому участнику.",
    category: "c_economy",
    aliases: ["give-money", "gm", "pay", "пер"],
    accessableby: "Для всех",
    usage: "[никнейм участника | упоминание | ID] [кол-во монет] "
  },
  run: async (bot, message, args) => {
    try {
     if (!args[0]) return embed(message).setError("Укажите участника.").send().then(msg => {msg.delete({timeout: "10000"})});
     user2 = message.member;
     let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
     if (user.user.id === user2.id) return embed(message).setError("Вы не сможете перевести деньги самому себе.").send().then(msg => {msg.delete({timeout: "10000"})});

     if(!args[1]) return embed(message).setError("Укажите кол-во монет, чтобы перевести.").send().then(msg => {msg.delete({timeout: "10000"})});
     if(isNaN(args[1]) && args[1] !== "all") return embed(message).setError("Укажите кол-во монет в виде числ, чтобы перевести.").send().then(msg => {msg.delete({timeout: "10000"})});

     let profileDataMember = await profileModel.findOne({ userID: user.id });
     let profileDataAuthor = await profileModel.findOne({ userID: user2.id });

     let memberMoney = profileDataAuthor.coins
     if(memberMoney <= 0 || memberMoney < args[1]) return embed(message).setError("У вас недостаточно денег.").send().then(msg => {msg.delete({timeout: "10000"})});
     if(10 > args[1]) return embed(message).setError("Минимальная сумма **10**.").send().then(msg => {msg.delete({timeout: "10000"})});




     if (args[1] === "all") {
       args[1] = memberMoney;
       await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(args[1])}})
       await profileModel.findOneAndUpdate({userID: user2.id},{$inc: {coins: Math.floor(-args[1])}})
     } else {
       await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(args[1])}})
       await profileModel.findOneAndUpdate({userID: user2.id},{$inc: {coins: Math.floor(-args[1])}})
     }


     embed(message).setPrimary(`Изменение баланса: Перевод\n\nКому: <@${user.id}>\nКол-во монет: ${COIN}**${Math.floor(args[1])}**`).send();
    } catch (e) {
     console.log(e);
    }
  }
}
