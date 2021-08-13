const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, STAR } = require("../../config");
const { checkValue } = require("../../functions");
const embed = require('../../embedConstructor');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "прокачать",
    aliases: ['upgrade'],
    category: 'h_roleplay',
    description: "Прокачать уровень героя.",
    usage: "(инфо | info)",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return
    
    const rp = await rpg.findOne({userID: message.author.id});
    const data = await bd.findOne({userID: message.author.id});
    const bal = data.stars;

    if(!rp || rp.item === null) {
    return embed(message).setError('Вы не имеете героя.').send().then(msg => msg.delete({timeout: "10000"}))
    };
    let hero = heroes[rp.item]
    let firstLevel = 1;
    let levelCost = hero.upgradeCost;

    let requiredValue = rp.level * levelCost;

    const resp = ['инфо', 'info']

    let addH = 150;
    let addD = 10;

    if(args[0] && resp.includes(args[0])) {
      const newEmb = new MessageEmbed()
      .setColor(cyan)
      .setTimestamp()
      .setAuthor(`Информация о прокачке уровня до ${rp.level+1}`)
      .setTitle(`${hero.name} (${hero.nameRus})`)
      .setDescription(`**Стоимость прокачки: ${requiredValue} ${STAR}**`)
      .addField(`❤ Общая жизнь:`, `${rp.health} + ${addH}`, true)
      .addField(`⚔ Общая атака:`, `${rp.damage} + ${addD}`, true)
      .setThumbnail(hero.url)

      return message.channel.send(newEmb)
    }
    if (bal < requiredValue) return embed(message).setError(`У вас недостаточно денег.\nСтоимость прокачки до следующего уровня **${requiredValue}** ${STAR}.`).send();



    await rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {level: 1}});
    await rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {health: addH}});
    await rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {damage: addD}});
    await bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: -requiredValue}});


    let Embed = new MessageEmbed()
    .setAuthor(`Уровень успешно прокачена до ${rp.level + 1}`)
    .setTitle(`${hero.name} (${hero.nameRus})`)
    .addField(`❤ Общая жизнь:`, `${rp.health + addH}`, true)
    .addField(`⚔ Общая атака:`, `${rp.damage + addD}`, true)
    .setColor(cyan)
    .setThumbnail(hero.url)

    return message.channel.send(Embed)
  }
};
