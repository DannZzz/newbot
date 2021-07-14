const {MessageEmbed} = require("discord.js");
const db = require("quick.db");
const {cyan, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');

module.exports = {
  config: {
    name: "баланс",
    description: "Показывает кол-во денег участника",
    category: "economy",
    aliases: ["бал", "bal", "balance", "кредиты"],
    accessableby: "Для всех",
    usage: " "
  },
  run: async (bot, message, args) => {
    let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
    let noEmbed = new MessageEmbed()
    .setColor(redlight)
    .setTimestamp()

    let bal = await db.fetch(`money_${member.id}`);

    if (bal === null) bal = 0;

    let bank = await db.fetch(`bank_${member.id}`)

    if (bank === null) bank = 0;

    let totalMoney = bal + bank;

    if (member) {
      let moneyEmbed = new MessageEmbed()
        .setColor(cyan)
        .setTimestamp()
        .setAuthor(member.user.username, member.user.displayAvatarURL({dynamic: true}))
        .setDescription(
          `Баланс: ${COIN}**${bal}**\nБанк: ${BANK}**${bank}**\n\nНа счету: ${COIN}**${totalMoney}**`
        );
      message.channel.send(moneyEmbed);
    } else {
      return message.channel.send(noEmbed.setDescription("Укажите участника."));
    }
  }
}
