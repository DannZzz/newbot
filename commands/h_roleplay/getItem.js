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
    name: "получить",
    aliases: ['get'],
    category: 'h_roleplay',
    description: "Приобретать героя.",
    usage: "[название героя]",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    const items = ["Zeenou", "Dilan", "Darius", "Selena", "Cthulhu", "Zeus"];
    const user = message.author;
    const coinData = await pd.findOne({userID: user.id});
    let rp = await rpg.findOne({userID: user.id});
    if (!rp) {
      let newData = await rpg.create({
        userID: user.id,
      });
      newData.save()
    }
    rp = await rpg.findOne({userID: user.id});
    let bag = await bd.findOne({ userID: user.id });
    const author = coinData.drag
    let timeout;
    if (bag["vip2"] === true) { timeout = 86400000 * 4 / 2 } else {
      timeout = 86400000 * 4;
    }
    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = new Date(timeout - (Date.now() - author));

        return embed(message).setError(`Вы недавно купили новый герой.\n\nПопробуй еще раз через **${Math.round(Math.abs(time) / 86400000)} дней**.`).send().then(msg => {msg.delete({timeout: "10000"})});
    }
    if (!args[0]) return embed(message).setError('Укажите героя.').send().then(msg => msg.delete({timeout: "10000"}))
    if (!items.includes(args[0])) return embed(message).setError('Герой не найден.').send().then(msg => msg.delete({timeout: "10000"}))
    const type = args[0];
    if (rp.item === null) {
      const item = heroes[type]

      if (item.vip === true) {
        if(bag["vip2"] !== true) {
          return embed(message).setError('Герой доступен только для **VIP 2** пользователей.').send().then(msg => msg.delete({timeout: "10000"}));
        }
      }

      if (item.costType === "coin" ) {
        if(await checkValue(user, item.cost)) {
          return embed(message).setError('У вас недостаточно денег, либо герой недоступен.').send().then(msg => msg.delete({timeout: "10000"}));
        }

        await pd.findOneAndUpdate({userID: user.id}, {$inc: {coins: -item.cost}});
        await pd.findOneAndUpdate({userID: user.id}, {$set: {drag: Date.now()}});

        await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: type}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: item.health}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: 1}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: item.damage}});

        return embed(message).setSuccess(`Вы успешно купили героя **${item.nameRus}.**`).send();
      } else if (item.costType === "star") {
        const stars = bag.stars
        if (item.cost > stars) {
          return embed(message).setError('У вас недостаточно звёзд, либо герой недоступен.').send().then(msg => msg.delete({timeout: "10000"}));
        }
        await bd.findOneAndUpdate({userID: user.id}, {$inc: {stars: -item.cost}});

        await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: type}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: item.health}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: 1}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: item.damage}});

        return embed(message).setSuccess(`Вы успешно купили героя **${item.nameRus}.**`).send();
      } else {
        return embed(message).setError('Герой недоступен для покупки монетами.').send().then(msg => msg.delete({timeout: "10000"}));
      }

    } else {
      return embed(message).setError(`Вы уже имеете герой, сначала убейте его, чтобы купить новый.`).send().then(msg => {msg.delete({timeout: "10000"})});

    }
    //

  }
};
