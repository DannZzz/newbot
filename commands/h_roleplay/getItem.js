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
    name: "получить",
    aliases: ['get'],
    category: 'h_roleplay',
    description: "Приобретать героя.",
    usage: "[название героя]",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    const items = ["Zeenou", "Dilan", "Darius", "Selena", "Cthulhu", "Zeus", "PerfectDuo", "Eragon", "Ariel"];
    const user = message.author;
    const coinData = await pd.findOne({userID: user.id});
    let rp = await rpg.findOne({userID: user.id});
    if (!rp) {
      let newData = await rpg.create({
        userID: user.id,
        surviveLevel: 1
      });
      newData.save()
    }
    rp = await rpg.findOne({ userID: user.id });
    let bag = await bd.findOne({ userID: user.id });
    const author = coinData.drag
    let timeout;
    if (bag["vip2"] === true) { timeout = 86400000 * 4 / 2 } else {
      timeout = 86400000 * 4;
    }
    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = new Date(timeout - (Date.now() - author));

        return error(message, `Вы недавно купили новый герой.\n\nПопробуй еще раз через **${Math.round(Math.abs(time) / 86400000)} дней**.`);
    }
    if (!args[0]) return error(message, 'Укажите героя.')
    if (!items.includes(args[0])) return error(message, 'Герой не найден.')
    const type = args[0];
    if (rp.heroes.length !== 2 && rp.heroes.length < 2) {
      const item = heroes[type]

      if (item.vip === true) {
        if(bag["vip2"] !== true) {
          return error(message, 'Герой доступен только для **VIP 2** пользователей.');
        }
      }

      if (rp.heroes.length === 1 && !coinData.allowMultiHeroes) return error(message, "У вас недостаточно мест.")

      if (rp.heroes.length === 1 && rp.heroes[0].name === type) return error(message, "Вы уже имеете этого героя.")

      if (item.costType === "star") {
        const stars = bag.stars
        if (item.cost > stars) {
          return error(message, 'У вас недостаточно звёзд, либо герой недоступен.');
        }
        await bd.findOneAndUpdate({userID: user.id}, {$inc: {stars: -item.cost}});
        await pd.findOneAndUpdate({userID: user.id}, {$set: {drag: Date.now()}})
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: type}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: item.health}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: 1}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: item.damage}});

        rp.heroes.push({
          name: type,
          health: item.health,
          damage: item.damage,
          level: 1
        })
        rp.save()
        
        return embed(message, `Вы успешно купили героя **${item.nameRus}.**`);
      } else {
        return error(message, 'Герой недоступен для покупки.');
      }

    } else {
      return error(message, `Вы уже имеете достаточно героев, сначала убейте одного, чтобы купить новый.`);

    }
    //

  }
};
