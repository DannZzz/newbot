const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const profileModel = require("../../models/profileSchema");
const embed = require('../../embedConstructor');
const mc = require('discordjs-mongodb-currency');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const {error} = require('../../functions');

module.exports = {
  config: {
    name: "обналичить",
    description: "Обналичить деньги из банка.",
    category: "c_economy",
    aliases: ["cash-out", "cash", "об", "with"],
    accessableby: "Для всех",
    usage: "[кол-во монет] "
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    try {

      if(!args[0]) return error(message, "Укажите кол-во денег, чтобы обналичить в банк.");
      if(isNaN(args[0]) && args[0] !== "all" && args[0] !== 'все') return error(message, "Укажите кол-во денег в виде числ.");
      let user = message.author;
      //args[0] = parseInt(args[0])
      let profileData = await mc.findUser(message.member.id, message.guild.id)

      let bal1 = profileData.coinsInWallet;//
      let bank1 = profileData.coinsInBank;

      if(args[0] > bank1) return error(message, "У вас недостаточно денег.");
      if(args[0] <= 0 || bank1 === 0) return error(message, "Минимальная сумма **1**.");


      if (args[0] === "all" || args[0] === 'все') {
        args[0] = bank1;
        if(args[0] > bank1) return
        await mc.withdraw(message.member.id, message.guild.id, Math.floor(args[0]));
        await mc.giveCoins(message.member.id, message.guild.id, Math.floor(args[0]));
      }else {
        if(args[0] > bank1) return
        await mc.withdraw(message.member.id, message.guild.id, Math.floor(args[0]));
        await mc.giveCoins(message.member.id, message.guild.id, Math.floor(args[0]));
      }
      embed(message).setPrimary(`Изменение баланса: Обналичивание\n\nКол-во денег: ${COIN}**${Math.floor(args[0])}**`).send();
    } catch (e) {
      console.log(e);
    }
  }
}
