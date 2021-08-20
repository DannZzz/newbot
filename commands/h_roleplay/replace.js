const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "заменить",
    aliases: ['replace'],
    category: 'h_roleplay',
    description: "Заменить своего основного героя.",
    usage: "",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    const user = message.author;
    const rp = await rpg.findOne({userID: user.id});
    if (!rp && rp.item !== null) return error(message, 'Вы не имеете героя.');
    if (rp.heroes.length !== 1){
      if (rp.heroes.length === 2) {

        if(rp.item === rp.heroes[0]["name"]) {
          await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: rp.heroes[1]["name"]}});
          await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: rp.heroes[1]["health"]}});
          await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: rp.heroes[1]["damage"]}});
          await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: rp.heroes[1]["level"]}});
        } else {
          await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: rp.heroes[0]["name"]}});
          await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: rp.heroes[0]["health"]}});
          await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: rp.heroes[0]["damage"]}});
          await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: rp.heroes[0]["level"]}});
        }
        
      const rpp = await rpg.findOne({userID: message.author.id})  
        
      const item = heroes[rpp.item]

    return embed(message, `Ваш основной герой сейчас - __${item.nameRus}__.`);
      }
  } else {
    return error(message, 'У вас один герой.');
  }

  }
};
