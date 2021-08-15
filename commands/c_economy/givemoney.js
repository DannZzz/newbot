const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const profileModel = require("../../models/profileSchema");
const mc = require('discordjs-mongodb-currency');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const {error} = require('../../functions');

module.exports = {
  config: {
    name: "перевести",
    description: "Перевести кол-во денег другому участнику.",
    category: "c_economy",
    aliases: ["give-money", "gm", "pay", "пер"],
    accessableby: "Для всех",
    usage: "[никнейм участника | упоминание | ID] [кол-во монет]"
  },
  run: async (bot, message, args, ops) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return
    let msg = await message.channel.send(`<a:dannloading:876008681479749662> Выполняется перевод...`)
    let a = Math.round(Math.random() * 6) + 1
    ops.queue.set(message.author.id, {name: "pay"})
    setTimeout(async function(){//
      try {
        await msg.delete()
       if (!args[0]) return error(message, "Укажите участника."); ops.queue.delete(message.author.id);
       user2 = message.member;
       let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
       if (user.user.id === user2.id) return error(message, "Вы не сможете перевести деньги самому себе."); ops.queue.delete(message.author.id);

       if(!args[1]) return error(message, "Укажите кол-во монет, чтобы перевести."); ops.queue.delete(message.author.id);
       if(isNaN(args[1]) && args[1] !== "all" && args[1] !== 'все') return error(message, "Укажите кол-во монет в виде числ, чтобы перевести."); ops.queue.delete(message.author.id);

       let profileDataMember = await mc.findUser(user.id, message.guild.id)
       let profileDataAuthor = await mc.findUser(user2.id, message.guild.id)

       let memberMoney = profileDataAuthor.coinsInWallet
       if(memberMoney <= 0 || memberMoney < args[1]) return error(message, "У вас недостаточно денег."); ops.queue.delete(message.author.id);
       if(10 > args[1]) return error(message, "Минимальная сумма **10**."); ops.queue.delete(message.author.id);
       let value = args[1]
       if (args[1] === "all" || args[1] === 'все') value = memberMoney;

       embed(message).setPrimary(`Изменение баланса: Перевод\n\nКому: <@${user.id}>\nКол-во монет: ${COIN}**${Math.floor(value)}**`).send().then(async () => {
         if(memberMoney <= 0 || memberMoney < args[1]) return
         if (args[1] === "all" || args[1] === 'все') {
           args[1] = memberMoney;
           await mc.giveCoins(user.id, message.guild.id, Math.floor(args[1]));
           await mc.deductCoins(user2.id, message.guild.id, Math.floor(args[1]));
           return ops.queue.delete(message.author.id)
         } else {
           await mc.giveCoins(user.id, message.guild.id, Math.floor(args[1]));
           await mc.deductCoins(user2.id, message.guild.id, Math.floor(args[1]));
           return ops.queue.delete(message.author.id)
         }
       })



      } catch (e) {
       console.log(e);
      }
    }, a * 1000)

  }
}
