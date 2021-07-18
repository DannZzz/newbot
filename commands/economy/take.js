const db = require("quick.db");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const profileModel = require("../../profileSchema");

module.exports = {
  config: {
    name: "обналичить",
    description: "Обналичить деньги из банка.",
    category: "economy",
    aliases: ["cash-out", "cash", "об", "with"],
    accessableby: "Для всех",
    usage: "[кол-во монет] "
  },
  run: async (bot, message, args) => {
    try {
      let iEmbed = new MessageEmbed()
      .setColor(redlight)
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

      if(!args[0]) return message.channel.send(iEmbed.setDescription("❌ Укажите кол-во денег, чтобы обналичить в банк.")).then(msg => {msg.delete({timeout: "10000"})});
      if(isNaN(args[0]) && args[0] !== "all") return message.channel.send(iEmbed.setDescription("❌ Укажите кол-во денег в виде числ.")).then(msg => {msg.delete({timeout: "10000"})});
      let user = message.author;
      let profileData = await profileModel.findOne({ userID: user.id });
      let bal1 = profileData.coins;
      let bank1 = profileData.bank;

      if(args[0] > bank1) return message.channel.send(iEmbed.setDescription("❌ У вас недостаточно денег.")).then(msg => {msg.delete({timeout: "10000"})});
      if(args[0] <= 0) return message.channel.send(iEmbed.setDescription("❌ Минимальная сумма **1**.")).then(msg => {msg.delete({timeout: "10000"})});


      if (args[0] === "all") {
        args[0] = bank1;
        await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(args[0]), bank: Math.floor(-args[0])}})
      }else {
          await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(args[0]), bank: Math.floor(-args[0])}})
      }




      let sEmbed = new MessageEmbed()
      .setColor(greenlight)
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
      .setDescription(`Изменение баланса: Обналичивание\n\nКол-во денег: ${COIN}**${Math.floor(args[0])}**`)

      message.channel.send(sEmbed);
    } catch (e) {
      console.log(e);
    }
  }
}
