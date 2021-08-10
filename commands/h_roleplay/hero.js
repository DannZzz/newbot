const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN } = require("../../config");
const { checkValue } = require("../../functions");
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "герой",
    aliases: ['hero'],
    category: 'h_roleplay',
    description: "Посмотреть статистику своего героя.",
    usage: "(участник)",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    const user = message.member;
    if(user.user.bot) return embed(message).setError('Бот не может иметь героя.').send().then(msg => msg.delete({timeout: "10000"}))
    const rp = await rpg.findOne({userID: user.id});
    if (!rp) return embed(message).setError('Вы не имеете героя.').send().then(msg => msg.delete({timeout: "10000"}))
    if(rp.item !== null) {
    const item = heroes[rp.item]
    let myHero = new MessageEmbed()
    .setAuthor(`Герой ${user.user.tag}`)
    .setTitle(`${item.name} (${item.nameRus})\nУровень: ${rp.level}`)
    .setDescription(item.description)
    .setThumbnail(item.url)
    .addField(`❤ Общая жизнь:`, `${rp.health}`, true)
    .addField(`⚔ Общая атака:`, `${rp.damage}`, true)
    .addField(`🟡 Сыграно игр:`, `${rp.totalGames}`, false)
    .addField(`🟢 Выиграно игр:`, `${rp.wins}`, true)
    .addField(`🔴 Проиграно игр:`, `${rp.loses}`, true)
    .addField(`🏆 Процент побед:`, `${Math.trunc(rp.wins / rp.totalGames  * 100) || '0'}%`, true)
    .setColor(cyan)

    return message.channel.send(myHero).then(msg => msg.delete({timeout: "5000"}))
  } else {
    return embed(message).setError('Вы не имеете героя.').send().then(msg => msg.delete({timeout: "10000"}))
  }

  }
};
