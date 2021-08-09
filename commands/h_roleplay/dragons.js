const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, STAR } = require("../../config");
const pagination = require("@xoalone/discordjs-pagination");

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
    let allDrags = []

    const zeenou = heroes["Zeenou"]
    const dragon1 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${zeenou.name} (${zeenou.nameRus}) ${cVip(zeenou.vip)}`)
    .setThumbnail(zeenou.url)
    .setDescription(zeenou.description)
    .addField(`Цена: ${zeenou.cost} ${COIN}`, `**Доступен: ${zeenou.available}**`, true)
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

    const emojies = ['⏪', '◀️', '⏹️', '▶️', '⏩']
    const timeout = '100000'
    const userids = [message.author.id]
    const pages = allDrags
    pagination(message, pages, emojies, timeout, false, userids)


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
