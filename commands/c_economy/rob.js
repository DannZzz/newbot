const begModel = require("../../models/begSchema");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const ms = require('ms');
const memberModel = require("../../models/memberSchema");
const embed = require('../../embedConstructor');
const owners = ['382906068319076372', '873237782825422968']
const mc = require('discordjs-mongodb-currency');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "воровать",
    description: "Воровать деньги участников.",
    category: "c_economy",
    aliases: ["rob", "роб", "вор"],
    accessableby: "Для всех",
    usage: "[никнейм участника | упоминание | ID]"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return
    try {
     if (!args[0]) return embed(message).setError("Укажите участника.").send().then(msg => {msg.delete({timeout: "10000"})});
     user2 = message.member;
     let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());

     let bag2 = await begModel.findOne({userID: user2.id});


     if (user.user.id === user2.id) return embed(message).setError("Вы не сможете воровать у себя.").send().then(msg => {msg.delete({timeout: "10000"})});
     if (owners.includes(user.id)) return embed(message).setError("Невозможно воровать у разработчика.").send().then(msg => {msg.delete({timeout: "10000"})});


     let profileData1 = await mc.findUser(user.id, message.guild.id)
     let profileData = await mc.findUser(user2.id, message.guild.id)
     let target = profileData1.coinsInWallet;
     if(isNaN(target)) target = 0
     let memberData = await memberModel.findOne({userID: user2.id, serverID: message.guild.id})
     let author = memberData.rob;

     let timeout;
     if (bag2["vip2"] === true) { timeout = 43200 * 1000; } else {
       timeout = 86400 * 1000;
     }


     if (author !== null && timeout - (Date.now() - author) > 0) {
       let time = new Date(timeout - (Date.now() - author));

       return embed(message).setError(`Вы уже недавно воровали.\n\nПопробуй снова через **${time.getUTCHours()} часа(ов) ${time.getMinutes()} минут**.`).send().then(msg => {msg.delete({timeout: "10000"})});
     } else {

       let random = Math.floor(target / 100 * (Math.floor(Math.random() * (36 - 10)) + 10));

       if (target < random) {return embed(message).setError(`К сожалению вы ничего не смогли воровать.`).send().then(msg => {msg.delete({timeout: "10000"})});
     } else {
       await memberModel.findOneAndUpdate({userID: user2.id, serverID: message.guild.id},{$set: {rob: Date.now()}});

       embed(message).setSuccess(`Вам удалось воровать у <@${user.id}> - кол-во денег: ${COIN}**${random}**`).send()

       await mc.deductCoins(user.id, message.guild.id, random || 1);
       await mc.giveCoins(user2.id, message.guild.id, random || 1);

     }


     }


   } catch (e){
     console.log(e);
   }
 }
}
