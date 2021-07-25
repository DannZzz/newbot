const begModel = require("../../models/begSchema");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const ms = require('ms');
const profileModel = require("../../models/profileSchema");


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
    try {
      let robEmbed = new MessageEmbed()
      .setColor(redlight)
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

     if (!args[0]) return message.channel.send(robEmbed.setDescription("❌ Укажите участника.")).then(msg => {msg.delete({timeout: "10000"})});
     user2 = message.member;
     let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
     let bag = await begModel.findOne({userID: user.id});
     let bag2 = await begModel.findOne({userID: user2.id});
     if(bag["vip1"]) return message.channel.send(robEmbed.setDescription("❌ Невозможно воровать у **VIP** участников.")).then(msg => {msg.delete({timeout: "10000"})});
     if (user.user.id === user2.id) return message.channel.send(robEmbed.setDescription("❌ Вы не сможете воровать у себя.")).then(msg => {msg.delete({timeout: "10000"})});



     let profileData1 = await profileModel.findOne({ userID: user.id });
     let profileData = await profileModel.findOne({ userID: user2.id });
     let target = profileData1.coins;
     let author = profileData.rob;

     let timeout;
     if (bag2["vip2"] === true) { timeout = 43200 * 1000; } else {
       timeout = 86400 * 1000;
     }


     if (author !== null && timeout - (Date.now() - author) > 0) {
       let time = new Date(timeout - (Date.now() - author));

       return message.channel.send(robEmbed.setDescription(`❌ Вы уже недавно воровали деньги у этого участника.\n\nПопробуй снова через **${time.getUTCHours()} часа(ов) ${time.getMinutes()} минут**.`)).then(msg => {msg.delete({timeout: "10000"})});
     } else {

       let random = Math.floor(target / 100 * (Math.floor(Math.random() * (36 - 10)) + 10));

       if (target < random) {return message.channel.send(robEmbed.setDescription(`❌ К сожалению вы ничего не смогли воровать.`)).then(msg => {msg.delete({timeout: "10000"})});
     } else {


       let sembed = new MessageEmbed()
       .setColor(greenlight)
       .setTimestamp()
       .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
       .setDescription(`✅ Вам удалось воровать у <@${user.id}> - кол-во денег: ${COIN}**${random}**`)

       message.channel.send(sembed)

       await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: -random}});
       await profileModel.findOneAndUpdate({userID: user2.id},{$inc: {coins: random}});
       await profileModel.findOneAndUpdate({userID: user2.id},{$set: {rob: Date.now()}});

     }


     }


   } catch (e){
     console.log(e);
   }
 }
}
