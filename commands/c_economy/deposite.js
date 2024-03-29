const embed = require('../../embedConstructor');
const { COIN, BANK } = require('../../config');
const profileModel = require("../../models/profileSchema");
const mc = require('discordjs-mongodb-currency');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const {error} = require('../../functions');

module.exports = {
  config: {
    name: "вложить",
    description: "Вкладывает деньги в банк.",
    category: "c_economy",
    aliases: ["invest", "in", "вл", "dep"],
    accessableby: "Для всех",
    usage: "[кол-во монет] "
  },
  run: async (bot, message, args, ops) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return
    let msg = await message.channel.send(`<a:dannloading:876008681479749662> Выполняется вложение...`)
    let a = Math.round(Math.random() * 6) + 1
    try {
      setTimeout(async function(){//
      const current = ops.queue.get(message.author.id);
      if (current) return error(message, `Пожалуйста подождите.`);
      await msg.delete()
      if(!args[0]) return error(message, "Укажите кол-во денег, чтобы вложить в банк.");
      if(isNaN(args[0]) && args[0] !== 'all' && args[0] !== 'все') return error(message, "Укажите кол-во денег в виде числ.");
      let user = message.author;
      let profileData = await mc.findUser(message.member.id, message.guild.id)


      let bal1 = profileData.coinsInWallet;//
      let bank1 = profileData.coinsInBank;

      if(args[0] > bal1) return error(message, "У вас недостаточно денег.");
      if(args[0] <= 0 || bal1 === 0) return error(message, "Минимальная сумма **1**.");
      let value = args[0]
      if(args[0] === 'all' || args[0] === 'все') value = bal1
      if(args[0] > bal1) return
      embed(message).setPrimary(`Изменение баланса: Вложение\n\nКол-во денег: ${COIN}**${Math.floor(value)}**`).send()

        if(args[0] === 'all' || args[0] === 'все') {
          args[0] = bal1
          if(args[0] > bal1) return
          await mc.deposit(message.member.id, message.guild.id, Math.floor(args[0]));
          await mc.deductCoins(message.member.id, message.guild.id, Math.floor(args[0]));
        } else {
          if(args[0] > bal1) return
        await mc.deposit(message.member.id, message.guild.id, Math.floor(args[0]));
        await mc.deductCoins(message.member.id, message.guild.id, Math.floor(args[0]));

      }

    }, a * 1000)
    } catch (e) {
      console.log(e);
    }
  }
}
