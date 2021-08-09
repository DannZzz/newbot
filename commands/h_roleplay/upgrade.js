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
    name: "прокачать",
    aliases: ['upgrade'],
    category: 'h_roleplay',
    description: "Прокачать уровень героя.",
    usage: "",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    const rp = await rpg.findOne({userID: message.author.id});
    const data = await pd.findOne({userID: message.author.id});
    const bal = data.coins;

    if(!rp || rp.item === null) {
    return embed(message).setError('Вы не имеете героя.').send().then(msg => msg.delete({timeout: "10000"}))
    };
    let firstLevel = 1;
    let levelCost = 300000;

    let requiredValue = rp.level * levelCost;

    if (bal < requiredValue) return embed(message).setError(`У вас недостаточно денег.\nСтоимость прокачки до следующего уровня **${requiredValue}**.`).send();

    let addH = 300;
    let addD = 15;

    await rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {level: 1}});
    await rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {health: addH}});
    await rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {damage: addD}});
    await pd.findOneAndUpdate({userID: message.author.id}, {$inc: {coins: -requiredValue}});

    let hero = heroes[rp.item]
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
