const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN } = require("../../config");
const { checkValue } = require("../../functions");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

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
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    const user = message.author;
    const rp = await rpg.findOne({userID: user.id});
    if (!rp) return error(message, 'Вы не имеете героя.');
    let bag = await bd.findOne({ userID: user.id });
    if(rp.item !== null && rp.heroes !== 0) {
      if (rp.heroes.length === 2) {
        if (!args[0]) return error(message, "Укажите героя, которого хотите убить.")
        const type = args[0]
        let getItem = rp.heroes;
        if(getItem[0]["name"] === type) {
        rp.heroes.shift()
        rp.save()
        } else if(getItem[1]["name"] === type) {
        rp.heroes.pop()
        rp.save()
          
        } else {
          return error(message, "Герой не найден!")
        }

        if (rp.item === type) {
          await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: rp.heroes[0]["name"]}});
          await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: rp.heroes[0]["health"]}});
          await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: rp.heroes[0]["damage"]}});
          await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: rp.heroes[0]["level"]}});
        }
        const item = heroes[type]
        return embed(message, `Вы успешно убили своего героя - __${item.nameRus}__.`);
      } else {
        const item = heroes[rp.item]
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: null}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: null}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: null}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: 1}});
        rp.heroes.pop();
        rp.save();
      }
      const item = heroes[item]
    
    

    return embed(message, `Вы успешно убили своего основного героя - __${item.nameRus}__.`);

  } else {
    return error(message, 'Вы не имеете героя.');
  }

  }
};
