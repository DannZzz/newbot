const vipModel = require("../../models/vipSchema");
const profileModel = require("../../models/profileSchema");
const begModel = require("../../models/begSchema");
const serverModel = require("../../models/serverSchema");
const fishes = require('../../JSON/fishes.json');
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const embed = require('../../embedConstructor');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const {error} = require('../../functions');

module.exports = {
  config: {
    name: 'продать',
    aliases: ['sell'],
    category: 'c_economy',
    description: 'Продать рыбы.',
    usage: '[ID рыб]',
    acessableby: 'Для всех'
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return
      let bal = await profileModel.findOne({userID: message.author.id});
      let bag = await begModel.findOne({userID: message.author.id});
      let sd = await serverModel.findOne({serverID: message.guild.id})
      let fish_sell;
      let rarity;
      let money;
      let cost;

      if (args[0] === '1') {
        fish_sell = bag.junk;
        cost = 1
        rarity = fishes['junk']
      }
      else if (args[0] === '2') {
        fish_sell = bag.common;
        cost = 2
        rarity = fishes['common']
      }
      else if (args[0] === '3') {
        fish_sell = bag.uncommon;
        cost = 3
        rarity = fishes['uncommon']
      }
      else if (args[0] === '4') {
        fish_sell = bag.rare;
        cost = 4
        rarity = fishes['rare']
      }
      else if (args[0] === '5') {
        fish_sell = bag.legendary;
        cost = 5
        rarity = fishes['legendary']
      } else {
        return error(message, `Айди рыб не найдено: **${sd.prefix}рыба лист**`);
      }
      const xx = fish_sell
      let exCost;
      if(bag['vip1']) exCost = cost + (cost / 3)
      if(xx === 0) return error(message, `Интересно, как продать "ничего".`);
      if(xx < 10) money = cost * xx;
      else if (xx < 100) money = exCost * xx;
      else if (xx > 100) money = exCost * xx * (exCost / 2);

      if (args[0] === '1') await begModel.findOneAndUpdate({userID: message.author.id},{$set: {junk: 0}})
      else if (args[0] === '2') await begModel.findOneAndUpdate({userID: message.author.id},{$set: {common: 0}})
      else if (args[0] === '3') await begModel.findOneAndUpdate({userID: message.author.id},{$set: {uncommon: 0}})
      else if (args[0] === '4') await begModel.findOneAndUpdate({userID: message.author.id},{$set: {rare: 0}})
      else if (args[0] === '5') await begModel.findOneAndUpdate({userID: message.author.id},{$set: {legendary: 0}})
      await begModel.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: Math.floor(money)}});

      embed(message).setSuccess(`Вы продали **${xx}**${rarity.symbol} всего за **${Math.floor(money)} ${STAR}**`).send()

  }
}
