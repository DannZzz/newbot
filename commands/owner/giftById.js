const begModel = require("../../models/begSchema");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, AGREE, STAR } = require('../../config');
let ownerID = '382906068319076372';
let darius = '873237782825422968'
const embed = require('../../embedConstructor');
const {error} = require('../../functions');

module.exports = {
  config: {
    name: "giftstars",
    description: "",
    category: "",
    aliases: "",
    accessableby: "Для разработчика.",
    usage: "[ID] [кол-во монет] "
  },
  run: async (bot, message, args) => {
     if(message.member.user.id !== ownerID || message.member.user.id !== darius) return
    if (!args[0]) return error(message, "Укажите участника.");

    let user = bot.users.cache.get(args[0]);
    try {
      let begData = await begModel.findOne({ userID: user.id });
    } catch {
      return error(message, "Данные не найдены.");
    }

    if(!args[1]) return error(message, "Укажите кол-во монет, чтобы добавить.");
    if(isNaN(args[1])) return error(message, "Укажите кол-во монет в виде, чтобы добавить.");
    if(args[1] > 1000000000) return error(message, "Укажите число меньше **1.000.000.000**.");
    if(args[1] < 10) return error(message, "Укажите число больше **10**.");

    await begModel.findOneAndUpdate({userID: user.id}, {$inc: {stars: Math.floor(args[1])}})
    message.react(`${AGREE}`)
    let msg = user.send(embed(message).setPrimary(`**У вас подарок от разработчика!🎉**\n\n||---**${Math.floor(args[1])}** ${STAR}---||`))



  }
}
