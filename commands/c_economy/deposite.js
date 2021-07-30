const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const profileModel = require("../../models/profileSchema");


module.exports = {
  config: {
    name: "вложить",
    description: "Вкладывает деньги в банк.",
    category: "c_economy",
    aliases: ["invest", "in", "вл", "dep"],
    accessableby: "Для всех",
    usage: "[кол-во монет] "
  },
  run: async (bot, message, args) => {
    try {
      if(!args[0]) return embed(message).setError("Укажите кол-во денег, чтобы вложить в банк.").send().then(msg => {msg.delete({timeout: "10000"})});
      if(isNaN(args[0]) && args[0] !== 'all') return embed(message).setError("Укажите кол-во денег в виде числ.").send().then(msg => {msg.delete({timeout: "10000"})});
      let user = message.author;
      let profileData = await profileModel.findOne({ userID: user.id });


      let bal1 = profileData.coins;//
      let bank1 = profileData.bank;

      if(args[0] > bal1) return embed(message).setError("У вас недостаточно денег.").send().then(msg => {msg.delete({timeout: "10000"})});
      if(args[0] <= 0) return embed(message).setError("Минимальная сумма **1**.").send().then(msg => {msg.delete({timeout: "10000"})});


      if(args[0] === 'all') {
        args[0] = bal1
        await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(-args[0]), bank: Math.floor(args[0])}})


      } else {
        await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(-args[0]), bank: Math.floor(args[0])}})
      }
      embed(message).setPrimary(`Изменение баланса: Вложение\n\nКол-во денег: ${COIN}**${Math.floor(args[0])}**`).send()
    } catch (e) {
      console.log(e);
    }
  }
}
