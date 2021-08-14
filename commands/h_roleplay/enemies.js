const enemies = require('../../JSON/enemies.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, STAR } = require("../../config");
const pagination = require("@xoalone/discordjs-pagination");

module.exports = {
  config: {
    name: "враги",
    aliases: ['enemies'],
    category: 'h_roleplay',
    description: "Информация о врагах.",
    usage: "",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let allEnemies = []

    const jorj = enemies["Jorj"]
    const enemy1 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${jorj.name} (${jorj.nameRus})`)
    .setThumbnail(jorj.url)
    .setDescription(jorj.description)
    .addField(`Жизнь: ❤ ${jorj.health} х уровень`, `**Атака: ⚔ ${jorj.damage}** х уровень`, true)
    allEnemies.push(enemy1)

    const cousin = enemies["Cousin"]
    const enemy2 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${cousin.name} (${cousin.nameRus})`)
    .setThumbnail(cousin.url)
    .setDescription(cousin.description)
    .addField(`Жизнь: ❤ ${cousin.health} х уровень`, `**Атака: ⚔ ${cousin.damage}** х уровень`, true)
    allEnemies.push(enemy2)

    const arthas = enemies["Arthas"]
    const enemy3 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${arthas.name} (${arthas.nameRus})`)
    .setThumbnail(arthas.url)
    .setDescription(arthas.description)
    .addField(`Жизнь: ❤ ${arthas.health} х уровень`, `**Атака: ⚔ ${arthas.damage}** х уровень`, true)
    allEnemies.push(enemy3)

    const dLord = enemies["D'Lord"]
    const enemy4 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${dLord.name} (${dLord.nameRus})`)
    .setThumbnail(dLord.url)
    .setDescription(dLord.description)
    .addField(`Жизнь: ❤ ${dLord.health} х уровень`, `**Атака: ⚔ ${dLord.damage}** х уровень`, true)
    allEnemies.push(enemy4)

    const emojies = ['⏪', '◀️', '⏹️', '▶️', '⏩']
    const timeout = '100000'
    const userids = [message.author.id]
    const pages = allEnemies
    pagination(message, pages, emojies, timeout, false, userids)


  }
};
