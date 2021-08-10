const {MessageEmbed} = require("discord.js");
const {cyan, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const embed = require('../../embedConstructor');
const mc = require('discordjs-mongodb-currency');
const profileModel = require("../../models/profileSchema");


module.exports = {
  config: {
    name: "баланс",
    description: "Показывает баланс участника.",
    category: "c_economy",
    aliases: ["бал", "bal", "balance", "кредиты"],
    accessableby: "Для всех",
    usage: ""
  },
  run: async (bot, message, args) => {
    let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
    let noEmbed = new MessageEmbed()
    .setColor(redlight)
    .setTimestamp()


    const data = await mc.findUser(member.id, message.guild.id);



    if (member) {
      let moneyEmbed = new MessageEmbed()
        .setColor(cyan)
        .setTimestamp()
        .setAuthor(member.user.username, member.user.displayAvatarURL({dynamic: true}))
        .setDescription(
          `Баланс: ${COIN}**${data.coinsInWallet}**\nБанк: ${BANK}**${data.coinsInBank}**\n\nНа счету: ${COIN}**${data.coinsInBank + data.coinsInWallet}**`
        );
      message.channel.send(moneyEmbed);
    } else {
      return embed(message).setError("Укажите участника.").send();
    }
  }
}
