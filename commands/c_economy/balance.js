const {MessageEmbed} = require("discord.js");
const {cyan, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');

const profileModel = require("../../models/profileSchema");


module.exports = {
  config: {
    name: "баланс",
    description: "Показывает кол-во денег участника",
    category: "c_economy",
    aliases: ["бал", "bal", "balance", "кредиты"],
    accessableby: "Для всех",
    usage: " "
  },
  run: async (bot, message, args) => {
    let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
    let noEmbed = new MessageEmbed()
    .setColor(redlight)
    .setTimestamp()


    profileData = await profileModel.findOne({ userID: member.id });



    if (member) {
      let moneyEmbed = new MessageEmbed()
        .setColor(cyan)
        .setTimestamp()
        .setAuthor(member.user.username, member.user.displayAvatarURL({dynamic: true}))
        .setDescription(
          `Баланс: ${COIN}**${profileData.coins}**\nБанк: ${BANK}**${profileData.bank}**\n\nНа счету: ${COIN}**${profileData.bank + profileData.coins}**`
        );
      message.channel.send(moneyEmbed);
    } else {
      return message.channel.send(noEmbed.setDescription("Укажите участника."));
    }
  }
}
