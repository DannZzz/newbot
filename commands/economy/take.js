const db = require("quick.db");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');

module.exports = {
  config: {
    name: "обналичить",
    description: "Обналичить деньги из банка.",
    category: "economy",
    aliases: ["cash-out", "cash", "об"],
    accessableby: "Для всех",
    usage: "[кол-во монет] "
  },
  run: async (bot, message, args) => {
    try {
      let iEmbed = new MessageEmbed()
      .setColor(redlight)
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

      if(!args[0]) return message.channel.send(iEmbed.setDescription("❌ Укажите кол-во денег, чтобы обналичить в банк.")).then(msg => {msg.delete({timeout: "10000"})});
      if(isNaN(args[0])) return message.channel.send(iEmbed.setDescription("❌ Укажите кол-во денег в виде числ.")).then(msg => {msg.delete({timeout: "10000"})});
      let user = message.author;
      let bal1 = await db.fetch(`money_${user.id}`);
      let bank1 = await db.fetch(`bank_${user.id}`);

      if(args[0] > bank1) return message.channel.send(iEmbed.setDescription("❌ У вас недостаточно денег.")).then(msg => {msg.delete({timeout: "10000"})});


      db.add(`money_${user.id}`, args[0]);
      db.subtract(`bank_${user.id}`, args[0]);

      let bal = await db.fetch(`money_${user.id}`);

      let sEmbed = new MessageEmbed()
      .setColor(greenlight)
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
      .setDescription(`Изменение баланса: Обналичивание\n\nКол-во денег: ${COIN}**${args[0]}**\nБаланс: ${COIN}**${bal}**`)

      message.channel.send(sEmbed);
    } catch (e) {
      console.log(e);
    }
  }
}
