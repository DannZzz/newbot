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
    name: "перевести",
    description: "Перевести кол-во денег другому участнику.",
    category: "c_economy",
    aliases: ["give-money", "gm", "pay", "пер"],
    accessableby: "Для всех",
    usage: "[никнейм участника | упоминание | ID] [кол-во монет]"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return
    let msg = await message.channel.send(`<a:dannloading:876008681479749662> Выполняется перевод...`)
    setTimeout(async function(){
      await msg.delete()
      try {
       if (!args[0]) return embed(message).setError("Укажите участника.").send().then(msg => {msg.delete({timeout: "10000"})});
       user2 = message.member;
       let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
       if (user.user.id === user2.id) return embed(message).setError("Вы не сможете перевести деньги самому себе.").send().then(msg => {msg.delete({timeout: "10000"})});

       if(!args[1]) return embed(message).setError("Укажите кол-во монет, чтобы перевести.").send().then(msg => {msg.delete({timeout: "10000"})});
       if(isNaN(args[1]) && args[1] !== "all" && args[1] !== 'все') return embed(message).setError("Укажите кол-во монет в виде числ, чтобы перевести.").send().then(msg => {msg.delete({timeout: "10000"})});

       let profileDataMember = await mc.findUser(user.id, message.guild.id)
       let profileDataAuthor = await mc.findUser(user2.id, message.guild.id)

       let memberMoney = profileDataAuthor.coinsInWallet
       if(memberMoney <= 0 || memberMoney < args[1]) return embed(message).setError("У вас недостаточно денег.").send().then(msg => {msg.delete({timeout: "10000"})});
       if(10 > args[1]) return embed(message).setError("Минимальная сумма **10**.").send().then(msg => {msg.delete({timeout: "10000"})});
       let value = args[1]
       if (args[1] === "all" || args[1] === 'все') value = memberMoney;

       embed(message).setPrimary(`Изменение баланса: Перевод\n\nКому: <@${user.id}>\nКол-во монет: ${COIN}**${Math.floor(value)}**`).send();

         if(memberMoney <= 0 || memberMoney < args[1]) return
         if (args[1] === "all" || args[1] === 'все') {
           args[1] = memberMoney;
           await mc.giveCoins(user.id, message.guild.id, Math.floor(args[1]));
           await mc.deductCoins(user2.id, message.guild.id, Math.floor(args[1]));
         } else {
           await mc.giveCoins(user.id, message.guild.id, Math.floor(args[1]));
           await mc.deductCoins(user2.id, message.guild.id, Math.floor(args[1]));
         }

      } catch (e) {
       console.log(e);
      }
    }, 4000)

  }
}