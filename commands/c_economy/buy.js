const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "купить",
    description: "Купить предметы из магазина.",
    category: "c_economy",
    aliases: ["buy"],
    accessableby: "Для всех",
    usage: "[предмет] <количество>"
  },
  run: async (bot, message, args) => {
    let data = await begModel.findOne({ userID: message.author.id });
    let checkVip = await vipModel.findOne({ userID: message.author.id })
    let bal = await profileModel.findOne({userID: message.author.id});
    let c = message.channel;

    if (!args[0]) return embed(message).setError(`Укажите предмет!`).send().then(msg => {msg.delete({timeout: "10000"})});
    if (args[0] === "vip-1" || args[0] === 'VIP-1') {
      if (data['vip1']) {
        return embed(message).setError("Вы уже имеете VIP!").send().then(msg => {msg.delete({timeout: "10000"})});
      } else {
        if(data.stars >= 1000) {
          await begModel.findOneAndUpdate({userID: message.author.id}, {$set: {'vip1': true}});
          await begModel.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: -1000}});

          embed(message).setSuccess(`Вы успешно купили VIP!`).send();
        } else {
          return embed(message).setError("У вас недостаточно звезд!").send().then(msg => {msg.delete({timeout: "10000"})});
        }
      }

    } else if (args[0] === "vip-2" || args[0] === 'VIP-2') {
      if (data['vip1'] === false) return embed(message).setError("Вы сначала должны иметь **VIP 1**!").send().then(msg => {msg.delete({timeout: "10000"})});
      if (data['vip2']) {
        return embed(message).setError("Вы уже имеете VIP!").send().then(msg => {msg.delete({timeout: "10000"})});
      } else {
        if(data.stars >= 10000) {
          await begModel.findOneAndUpdate({userID: message.author.id}, {$set: {'vip2': true}});
          await begModel.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: -10000}})

          embed(message).setSuccess(`Вы успешно купили VIP!`).send()
        } else {
          return embed(message).setError("У вас недостаточно звезд!").send().then(msg => {msg.delete({timeout: "10000"})});
        }
      }
    } else if (args[0] === "звезды" || args[0] === 'звёзды'  || args[0] === 'stars') {
      if (!args[1]) return embed(message).setError(`Укажите кол-во звезд!`).send().then(msg => {msg.delete({timeout: "10000"})});
      if(isNaN(args[1])) return embed(message).setError(`Укажите кол-во звезд!`).send().then(msg => {msg.delete({timeout: "10000"})});
      if ((args[1] * 100000) > bal.coins) return embed(message).setError(`У вас недостаточно денег!`).send().then(msg => {msg.delete({timeout: "10000"})});
      let cost = Math.floor(args[1]) * 100000
      await profileModel.findOneAndUpdate({userID: message.author.id}, {$inc: {coins: -cost}})
      await begModel.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: args[1]}})

      embed(message).setSuccess(`Вы успешно купили **${Math.floor(args[1])} ${STAR}** за **${cost} ${COIN}**`).send()
    } else {
      return embed(message).setError("Предмет не найден!").send().then(msg => {msg.delete({timeout: "10000"})});
    }

  }
}
