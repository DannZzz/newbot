const db = require("quick.db");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');

module.exports = {
  config: {
    name: "вложить",
    description: "Вкладывает деньги в банк.",
    category: "economy",
    aliases: ["invest", "in", "вл", "dep"],
    accessableby: "Для всех",
    usage: "[кол-во монет] "
  },
  run: async (bot, message, args) => {
    try {
      let iEmbed = new MessageEmbed()
      .setColor(redlight)
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

      if(!args[0]) return message.channel.send(iEmbed.setDescription("❌ Укажите кол-во денег, чтобы вложить в банк.")).then(msg => {msg.delete({timeout: "10000"})});
      if(isNaN(args[0]) && args[0] !== 'all') return message.channel.send(iEmbed.setDescription("❌ Укажите кол-во денег в виде числ.")).then(msg => {msg.delete({timeout: "10000"})});
      let user = message.author;
      let bal1 = await db.fetch(`money_${user.id}`);
      let bank1 = await db.fetch(`bank_${user.id}`);

      if(args[0] > bal1) return message.channel.send(iEmbed.setDescription("❌ У вас недостаточно денег.")).then(msg => {msg.delete({timeout: "10000"})});

      if(args[0] === 'all') {
        args[0] = bal1
        db.add(`bank_${user.id}`, args[0]);
        db.subtract(`money_${user.id}`, args[0]);

      } else {
        db.add(`bank_${user.id}`, args[0]);
        db.subtract(`money_${user.id}`, args[0]);
      }

      let bank = await db.fetch(`bank_${user.id}`);

      let sEmbed = new MessageEmbed()
      .setColor(greenlight)
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
      .setDescription(`Изменение баланса: Вложение\n\nКол-во денег: ${COIN}**${args[0]}**\nБанк: ${BANK}**${bank}**`)

      message.channel.send(sEmbed);
    } catch (e) {
      console.log(e);
    }
  }
}
