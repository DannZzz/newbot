const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN } = require("../../config");
const { checkValue } = require("../../functions");
const embed = require('../../embedConstructor');
const {error} = require('../../functions');

module.exports = {
  config: {
    name: "убить",
    aliases: ['kill'],
    category: 'h_roleplay',
    description: "Убить своего героя.",
    usage: "",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    const user = message.author;
    const rp = await rpg.findOne({userID: user.id});
    if (!rp) return error(message, 'Вы не имеете героя.');
    let bag = await bd.findOne({ userID: user.id });
    if(rp.item !== null) {
    const item = heroes[rp.item]
    await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: null}});
    await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: null}});
    await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: null}});
    await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: 1}});


    return embed(message).setSuccess(`Вы успешно убили своего героя - **${item.nameRus}**.`).send();

  } else {
    return error(message, 'Вы не имеете героя.');
  }

  }
};
