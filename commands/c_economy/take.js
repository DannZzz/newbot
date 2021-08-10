const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const profileModel = require("../../models/profileSchema");
const embed = require('../../embedConstructor');
const mc = require('discordjs-mongodb-currency');

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
    try {

      if(!args[0]) return embed(message).setError("Укажите кол-во денег, чтобы обналичить в банк.").send().then(msg => {msg.delete({timeout: "10000"})});
      if(isNaN(args[0]) && args[0] !== "all" && args[0] !== 'все') return embed(message).setError("Укажите кол-во денег в виде числ.").send().then(msg => {msg.delete({timeout: "10000"})});
      let user = message.author;
      let profileData = await mc.findUser(message.member.id, message.guild.id)

      let bal1 = profileData.coinsInWallet;//
      let bank1 = profileData.coinsInBank;

      if(args[0] > bank1) return embed(message).setError("У вас недостаточно денег.").send().then(msg => {msg.delete({timeout: "10000"})});
      if(args[0] <= 0 || bank1 === 0) return embed(message).setError("Минимальная сумма **1**.").send().then(msg => {msg.delete({timeout: "10000"})});


      if (args[0] === "all" || args[0] === 'все') {
        args[0] = bank1;
        await mc.withdraw(message.member.id, message.guild.id, args[0]);
        await mc.giveCoins(message.member.id, message.guild.id, args[0]);
      }else {
        await mc.withdraw(message.member.id, message.guild.id, args[0]);
        await mc.giveCoins(message.member.id, message.guild.id, args[0]);
      }
      embed(message).setPrimary(`Изменение баланса: Обналичивание\n\nКол-во денег: ${COIN}**${Math.floor(args[0])}**`).send();
    } catch (e) {
      console.log(e);
    }
  }
}
