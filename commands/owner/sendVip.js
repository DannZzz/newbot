const begModel = require("../../models/begSchema");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, AGREE } = require('../../config');
let ownerID = '382906068319076372';
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "sendvip",
    description: "",
    category: "",
    aliases: "",
    accessableby: "Для разработчика.",
    usage: "[ID] [название] "
  },
  run: async (bot, message, args) => {
    try {
    if (message.member.user.id !== ownerID) return embed(message).setError("К сожалению вы не разработчик.").send().then(msg => {msg.delete({timeout: "10000"})});
    if (!args[0]) return embed(message).setError("Укажите участника.").send().then(msg => {msg.delete({timeout: "10000"})});

    let user = bot.users.cache.get(args[0]);
    let bag
    try {
      bag = await begModel.findOne({ userID: user.id });
    } catch {
      return embed(message).setError("Данные не найдены.").send().then(msg => {msg.delete({timeout: "10000"})});
    }

    if(!args[1]) return embed(message).setError("Укажите подарок.").send().then(msg => {msg.delete({timeout: "10000"})});
    const vips = ['vip-1', 'vip-2']
    if (!vips.includes(args[1])) return embed(message).setError("Подарок не найден.").send().then(msg => {msg.delete({timeout: "10000"})});
    let giftType;
    if (args[1] === 'vip-1') {
      giftType = 'VIP-1';
      if(bag['vip1'] === false) {
        await begModel.findOneAndUpdate({userID: user.id}, {$set: {"vip1": true}})
        message.react(`${AGREE}`)
        return user.send(embed(message).setPrimary(`**У вас подарок от разработчика!🎉**\n\n||---**${giftType}**---||`))
      } else {
        return embed(message).setError('Пользователь уже имеет VIP 1.').send().then(msg => {msg.delete({timeout: "10000"})});

      }
    } else if (args[1] === 'vip-2') {
      giftType = 'VIP-2';
      if(bag['vip2'] === false) {
        await begModel.findOneAndUpdate({userID: user.id}, {$set: {"vip2": true}})
        return user.send(embed(message).setPrimary(`**У вас подарок от разработчика!🎉**\n\n||---**${giftType}**---||`))
      } else {
        return embed(message).setError('Пользователь уже имеет VIP 2.').send().then(msg => {msg.delete({timeout: "10000"})});
      }

    }
  } catch (e) {
    console.log(e);
  }
  }
}
