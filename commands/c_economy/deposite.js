const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const profileModel = require("../../models/profileSchema");
const mc = require('discordjs-mongodb-currency');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "вложить",
    description: "Вкладывает деньги в банк.",
    category: "c_economy",
    aliases: ["invest", "in", "вл", "dep"],
    accessableby: "Для всех",
    usage: "[кол-во монет] "
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    try {
      if(!args[0]) return embed(message).setError("Укажите кол-во денег, чтобы вложить в банк.").send().then(msg => {msg.delete({timeout: "10000"})});
      if(isNaN(args[0]) && args[0] !== 'all' && args[0] !== 'все') return embed(message).setError("Укажите кол-во денег в виде числ.").send().then(msg => {msg.delete({timeout: "10000"})});
      let user = message.author;
      let profileData = await mc.findUser(message.member.id, message.guild.id)


      let bal1 = profileData.coinsInWallet;//
      let bank1 = profileData.coinsInBank;

      if(args[0] > bal1) return embed(message).setError("У вас недостаточно денег.").send().then(msg => {msg.delete({timeout: "10000"})});
      if(args[0] <= 0 || bal1 === 0) return embed(message).setError("Минимальная сумма **1**.").send().then(msg => {msg.delete({timeout: "10000"})});
      let value = args[0]
      if(args[0] === 'all' || args[0] === 'все') value = bal1

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
    } catch (e) {
      console.log(e);
    }
  }
}
