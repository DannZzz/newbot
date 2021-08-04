const profileModel = require("../../models/profileSchema");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN } = require('../../config');
let ownerID = '382906068319076372';
const embed = require('../../embedConstructor');

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
     if(message.member.user.id !== ownerID) return embed(message).setError("К сожалению вы не разработчик.").send().then(msg => {msg.delete({timeout: "10000"})});
    if (!args[0]) return embed(message).setError("Укажите участника.").send().then(msg => {msg.delete({timeout: "10000"})});

    let user = bot.users.cache.get(args[0]);
    try {
      let profileData = await profileModel.findOne({ userID: user.id });
    } catch {
      return embed(message).setError("Данные не найдены.").send().then(msg => {msg.delete({timeout: "10000"})});
    }

    if(!args[1]) return embed(message).setError("Укажите кол-во монет, чтобы добавить.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(isNaN(args[1])) return embed(message).setError("Укажите кол-во монет в виде, чтобы добавить.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(args[1] > 1000000000) return embed(message).setError("Укажите число меньше **1.000.000.000**.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(args[1] < 10) return embed(message).setError("Укажите число больше **10**.").send().then(msg => {msg.delete({timeout: "10000"})});

    await profileModel.findOneAndUpdate({userID: user.id}, {$inc: {bank: Math.floor(args[1])}})
    let msg = user.send(embed(message).setPrimary(`**У вас подарок от разработчика!🎉**\n\n||---**${Math.floor(args[1])}** ${COIN}---||`))



  }
}
