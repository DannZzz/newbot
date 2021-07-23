const vipModel = require("../../models/vipSchema");
const profileModel = require("../../models/profileSchema");
const begModel = require("../../models/begSchema");
const serverModel = require("../../models/serverSchema");
const fishes = require('../../JSON/fishes.json');
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');

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
    let Embed = new MessageEmbed()
        .setColor(redlight)
        .setTimestamp()
        .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

        let sembed = new MessageEmbed()
            .setColor(greenlight)
            .setTimestamp()
            .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
      let bal = await profileModel.findOne({userID: message.author.id});
      let bag = await begModel.findOne({userID: message.author.id});
      let sd = await serverModel.findOne({serverID: message.guild.id})
      let fish_sell;
      let rarity;
      let money;
      let cost;

      if (args[0] === '1') {
        fish_sell = bag.junk;
        cost = 20
        rarity = fishes['junk']
      }
      else if (args[0] === '2') {
        fish_sell = bag.common;
        cost = 50
        rarity = fishes['common']
      }
      else if (args[0] === '3') {
        fish_sell = bag.uncommon;
        cost = 80
        rarity = fishes['uncommon']
      }
      else if (args[0] === '4') {
        fish_sell = bag.rare;
        cost = 150
        rarity = fishes['rare']
      }
      else if (args[0] === '5') {
        fish_sell = bag.legendary;
        cost = 450
        rarity = fishes['legendary']
      } else {
        message.channel.send(Embed.setDescription(`Айди рыб не найдено: **${sd.prefix}рыба лист**`))
      }
      let exCost = cost + (cost / 2)
      if(bag['vip1']) exCost = cost + (cost / 2) + (cost / 3)
      if(fish_sell < 10) money = cost * fish_sell;
      else if (fish_sell < 100) money = exCost * fish_sell;



      await profileModel.findOneAndUpdate({userID: message.author.id}, {$inc: {coins: money}});
      if (fish_sell === bag.junk) await begModel.findOneAndUpdate({userID: message.author.id},{$set: {junk: 0}})
      else if (fish_sell === bag.common) await begModel.findOneAndUpdate({userID: message.author.id},{$set: {common: 0}})
      else if (fish_sell === bag.uncommon) await begModel.findOneAndUpdate({userID: message.author.id},{$set: {uncommon: 0}})
      else if (fish_sell === bag.rare) await begModel.findOneAndUpdate({userID: message.author.id},{$set: {rare: 0}})
      else if (fish_sell === bag.legendary) await begModel.findOneAndUpdate({userID: message.author.id},{$set: {legendary: 0}})

      message.channel.send(sembed.setDescription(`Вы продали **${fish_sell}**${rarity.symbol} всего за **${money} ${COIN}**`))

  }
}
