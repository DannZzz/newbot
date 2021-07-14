const db = require("quick.db");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const ms = require('ms');

module.exports = {
  config: {
    name: "воровать",
    description: "Воровать деньги участников.",
    category: "economy",
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
     if (user.user.id === user2.id) return message.channel.send(robEmbed.setDescription("❌ Вы не сможете воровать у себя.")).then(msg => {msg.delete({timeout: "10000"})});

     let target = await db.fetch(`money_${user.id}`);
     let author = await db.fetch(`rob_${user.id}`);
     let author2 = await db.fetch(`money_${user2.id}`);

     let timeout = 120000000;

     if (author !== null && timeout - (Date.now() - author) > 0) {
       let time = ms(timeout - (Date.now() - author));

       return message.channel.send(robEmbed.setDescription(`❌ Вы уже недавно воровали деньги у этого участника.\n\nПопробуй снова через **${time}**.`)).then(msg => {msg.delete({timeout: "10000"})});
     } else {
       if (author2 < 100) return message.channel.send(robEmbed.setDescription(`❌ Вы должны иметь не менее 100 монет, чтобы воровать у кого-то.`)).then(msg => {msg.delete({timeout: "10000"})});

       let random = Math.floor(Math.random() * 300) + 1

       if (target < random) {return message.channel.send(robEmbed.setDescription(`❌ К сожалению вы ничего не смогли воровать.`)).then(msg => {msg.delete({timeout: "10000"})});
     } else {


       let sembed = new MessageEmbed()
       .setColor(greenlight)
       .setTimestamp()
       .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
       .setDescription(`✅ Вам удалось воровать у <@${user.id}> - кол-во денег: ${COIN}**${random}**`)

       message.channel.send(sembed)

       db.subtract(`money_${user.id}`, random)
       db.add(`money_${user2.id}`, random)
       db.set(`rob_${user.id}`, Date.now())
     }


     }


   } catch (e){
     console.log(e);
   }
 }
}
