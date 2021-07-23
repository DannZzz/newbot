const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");


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

    let embed = new MessageEmbed()
      .setColor(redlight)
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))


    let sembed = new MessageEmbed()
       .setColor(greenlight)
       .setTimestamp()
       .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))


    if (!args[0]) return c.send(embed.setDescription(`❌ Укажите предмет!`)).then(msg => {msg.delete({timeout: "10000"})});
    if (args[0] === "vip-1" || args[0] === 'VIP-1') {
      if (data['vip1']) {
        return c.send(embed.setDescription("❌ Вы уже имеете VIP!")).then(msg => {msg.delete({timeout: "10000"})});
      } else {
        if(data.stars >= 1000) {
          await begModel.findOneAndUpdate({userID: message.author.id}, {$set: {'vip1': true}});
          await begModel.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: -1000}})

          c.send(sembed.setDescription(`✅ Вы успешно купили VIP!`))
        } else {
          return c.send(embed.setDescription("❌ У вас недостаточно звезд!")).then(msg => {msg.delete({timeout: "10000"})});
        }
      }

    } else if (args[0] === "vip-2" || args[0] === 'VIP-2') {
      if (data['vip1'] === false) return c.send(embed.setDescription("❌ Вы сначала должны иметь **VIP 1**!")).then(msg => {msg.delete({timeout: "10000"})});
      if (data['vip2']) {
        return c.send(embed.setDescription("❌ Вы уже имеете VIP!")).then(msg => {msg.delete({timeout: "10000"})});
      } else {
        if(data.stars >= 10000) {
          await begModel.findOneAndUpdate({userID: message.author.id}, {$set: {'vip2': true}});
          await begModel.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: -10000}})

          c.send(sembed.setDescription(`✅ Вы успешно купили VIP!`))
        } else {
          return c.send(embed.setDescription("❌ У вас недостаточно звезд!")).then(msg => {msg.delete({timeout: "10000"})});
        }
      }
    } else if (args[0] === "звезды" || args[0] === 'звёзды'  || args[0] === 'stars') {
      if (!args[1]) return c.send(embed.setDescription(`❌ Укажите кол-во звезд!`)).then(msg => {msg.delete({timeout: "10000"})});
      if(isNaN(args[1])) return c.send(embed.setDescription(`❌ Укажите кол-во звезд!`)).then(msg => {msg.delete({timeout: "10000"})});
      if ((args[1] * 100000) > bal.coins) return c.send(embed.setDescription(`❌ У вас недостаточно денег!`)).then(msg => {msg.delete({timeout: "10000"})});
      let cost = Math.floor(args[1]) * 100000
      await profileModel.findOneAndUpdate({userID: message.author.id}, {$inc: {coins: -cost}})
      await begModel.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: args[1]}})

      c.send(sembed.setDescription(`✅ Вы успешно купили **${Math.floor(args[1])} ${STAR}** за **${cost} ${COIN}**`))
    } else {
      return c.send(embed.setDescription("❌ Предмет не найден!")).then(msg => {msg.delete({timeout: "10000"})});
    }

  }
}
