const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const { MessageEmbed, MessageButton } = require("discord.js");
const { COIN, STAR } = require("../../config");
const {error, pagination} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "герои",
    aliases: ['heroes'],
    category: 'h_roleplay',
    description: "Информация о героях.",
    usage: "",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    let allDrags = []

    const zeenou = heroes["Zeenou"]
    const dragon1 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${zeenou.name} (${zeenou.nameRus}) ${cVip(zeenou.vip)}`)
    .setThumbnail(zeenou.url)
    .setDescription(zeenou.description)
    .addField(`Цена: ${zeenou.cost} ${cType(zeenou.costType)}`, `**Доступен: ${zeenou.available}**`, true)
    .addField(`Жизнь: ${zeenou.health} ❤`, `**Атака: ${zeenou.damage}** ⚔`, true)
    allDrags.push(dragon1)

    const dilan = heroes["Dilan"]
    const dragon2 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${dilan.name} (${dilan.nameRus}) ${cVip(dilan.vip)}`)
    .setThumbnail(dilan.url)
    .setDescription(dilan.description)
    .addField(`Цена: ${dilan.cost} ${cType(dilan.costType)}`, `**Доступен: ${dilan.available}**`, true)
    .addField(`Жизнь: ${dilan.health} ❤`, `**Атака: ${dilan.damage}** ⚔`, true)
    allDrags.push(dragon2)

    const darius = heroes["Darius"]
    const dragon3 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${darius.name} (${darius.nameRus}) ${cVip(darius.vip)}`)
    .setThumbnail(darius.url)
    .setDescription(darius.description)
    .addField(`Цена: ${darius.cost} ${cType(darius.costType)}`, `**Доступен: ${darius.available}**`, true)
    .addField(`Жизнь: ${darius.health} ❤`, `**Атака: ${darius.damage}** ⚔`, true)
    allDrags.push(dragon3)

    const selena = heroes["Selena"]
    const dragon4 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${selena.name} (${selena.nameRus}) ${cVip(selena.vip)}`)
    .setThumbnail(selena.url)
    .setDescription(selena.description)
    .addField(`Цена: ${selena.cost} ${cType(selena.costType)}`, `**Доступен: ${selena.available}**`, true)
    .addField(`Жизнь: ${selena.health} ❤`, `**Атака: ${selena.damage}** ⚔`, true)
    allDrags.push(dragon4)

    const cthulhu = heroes["Cthulhu"]
    const dragon5 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${cthulhu.name} (${cthulhu.nameRus}) ${cVip(cthulhu.vip)}`)
    .setThumbnail(cthulhu.url)
    .setDescription(cthulhu.description)
    .addField(`Цена: ${cthulhu.cost} ${cType(cthulhu.costType)}`, `**Доступен: ${cthulhu.available}**`, true)
    .addField(`Жизнь: ${cthulhu.health} ❤`, `**Атака: ${cthulhu.damage}** ⚔`, true)
    allDrags.push(dragon5)

    const zeus = heroes["Zeus"]
    const dragon6 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${zeus.name} (${zeus.nameRus}) ${cVip(zeus.vip)}`)
    .setThumbnail(zeus.url)
    .setDescription(zeus.description)
    .addField(`Цена: ${zeus.cost} ${cType(zeus.costType)}`, `**Доступен: ${zeus.available}**`, true)
    .addField(`Жизнь: ${zeus.health} ❤`, `**Атака: ${zeus.damage}** ⚔`, true)
    allDrags.push(dragon6)

    const perfectDuo = heroes["PerfectDuo"]
    const dragon7 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${perfectDuo.name} (${perfectDuo.nameRus}) ${cVip(perfectDuo.vip)}`)
    .setThumbnail(perfectDuo.url)
    .setDescription(perfectDuo.description)
    .addField(`Цена: ${perfectDuo.cost} ${cType(perfectDuo.costType)}`, `**Доступен: ${perfectDuo.available}**`, true)
    .addField(`Жизнь: ${perfectDuo.health} ❤`, `**Атака: ${perfectDuo.damage}** ⚔`, true)
    allDrags.push(dragon7)

    const eragon = heroes["Eragon"]
    const dragon8 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${eragon.name} (${eragon.nameRus}) ${cVip(eragon.vip)}`)
    .setThumbnail(eragon.url)
    .setDescription(eragon.description)
    .addField(`Цена: ${eragon.cost} ${cType(eragon.costType)}`, `**Доступен: ${eragon.available}**`, true)
    .addField(`Жизнь: ${eragon.health} ❤`, `**Атака: ${eragon.damage}** ⚔`, true)
    allDrags.push(dragon8)

    const ariel = heroes["Ariel"]
    const dragon9 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${ariel.name} (${ariel.nameRus}) ${cVip(ariel.vip)}`)
    .setThumbnail(ariel.url)
    .setDescription(ariel.description)
    .addField(`Цена: ${ariel.cost} ${cType(ariel.costType)}`, `**Доступен: ${ariel.available}**`, true)
    .addField(`Жизнь: ${ariel.health} ❤`, `**Атака: ${ariel.damage}** ⚔`, true)
    allDrags.push(dragon9)

    const timeout = '100000'
    const userids = [message.author.id]
    const pages = allDrags
    const button1 = new MessageButton()
          .setCustomId('previousbtn')
          .setLabel('Предыдущая')
          .setStyle('DANGER');

          const button2 = new MessageButton()
          .setCustomId('nextbtn')
          .setLabel('Следующая')
          .setStyle('SUCCESS');

    let buttonList = [
        button1,
        button2
    ]
    pagination(message, pages, buttonList, timeout, userids)


    function cVip(bool) {
      let res = bool ? '-VIP-' : ''
      return res;
    }
    function cType(type) {
      if(type === 'star') {return STAR}
      else if (type === "coin") {
        return COIN
      } else if (type === 'dev'){
        return ''
      }
    }
  }
};
