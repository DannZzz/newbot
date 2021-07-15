const db = require("quick.db");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');

module.exports = {
  config: {
    name: "перевести",
    description: "Перевести кол-во денег другому участнику.",
    category: "economy",
    aliases: ["give-money", "gm", "pay", "пер"],
    accessableby: "Для всех",
    usage: "[никнейм участника | упоминание | ID] [кол-во монет] "
  },
  run: async (bot, message, args) => {
    try {
      let gEmbed = new MessageEmbed()
      .setColor(redlight)
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))


     if (!args[0]) return message.channel.send(gEmbed.setDescription("❌ Укажите участника.")).then(msg => {msg.delete({timeout: "10000"})});
     user2 = message.member;
     let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
     if (user.user.id === user2.id) return message.channel.send(gEmbed.setDescription("❌ Вы не сможете перевести деньги самому себе.")).then(msg => {msg.delete({timeout: "10000"})});

     if(!args[1]) return message.channel.send(gEmbed.setDescription("❌ Укажите кол-во монет, чтобы перевести.")).then(msg => {msg.delete({timeout: "10000"})});
     if(isNaN(args[1]) && args[1] !== "all") return message.channel.send(gEmbed.setDescription("❌ Укажите кол-во монет в виде числ, чтобы перевести.")).then(msg => {msg.delete({timeout: "10000"})});

     memberMoney = await db.fetch(`money_${user2.id}`)
     if(memberMoney < args[1]) return message.channel.send(gEmbed.setDescription("❌ У вас недостаточно денег.")).then(msg => {msg.delete({timeout: "10000"})});

     let sEmbed = new MessageEmbed()
     .setColor(greenlight)
     .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
     .setTitle("Перевод")
     .setTimestamp()

     if (args[1] === "all") {
       args[1] = memberMoney;
       db.add(`money_${user.id}`, args[1]);
       db.subtract(`money_${user2.id}`, args[1]);
     } else {
       db.add(`money_${user.id}`, args[1]);
       db.subtract(`money_${user2.id}`, args[1]);
     }


     let userBal = await db.fetch(`money_${user.id}`);
     let memberMoneyAfter = await db.fetch(`money_${user2.id}`);

     message.channel.send(sEmbed.setDescription(`Изменение баланса: Перевод\n\nКому: <@${user.id}>\nКол-во монет: ${COIN}**${args[1]}**\n\nБаланс: <@${user2.id}> - ${COIN}**${memberMoneyAfter}**\nБаланс: <@${user.id}> - ${COIN}**${userBal}**`))
    } catch (e) {
     console.log(e);
    }
  }
}
