const {MessageEmbed, MessageAttachment} = require("discord.js");
const {cyan, redlight} = require('../../JSON/colours.json');
const { COIN, BANK, MONGO } = require('../../config');
const embed = require('../../embedConstructor');
const mc = require('discordjs-mongodb-currency');
const profileModel = require("../../models/profileSchema");
const DiscordCanvas = require('@kuroxi/discord-canvas')
const mongoose = require("mongoose")


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
    const CurrencySchema = new mongoose.Schema({
        guildId: String,
        userId: String,
        coinsInWallet: Number,
        coinsInBank: Number,
        bankSpace: Number
    });
    let asd
    try {
      asd = mongoose.model('currencies')
    } catch (e) {
      asd = mongoose.model('currencies', CurrencySchema);
    }

    let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
    let noEmbed = new MessageEmbed()
    .setColor(redlight)
    .setTimestamp()


    //const data = await mc.findUser(member.id, message.guild.id);
    const data = await asd.findOne({userId: member.id, guildId: message.guild.id})

    const getRank = await asd.find({guildId: message.guild.id}).sort([['coinsInBank', 'descending']]).exec();

    let getFinal = await getRank.find(i => i.userId === member.id)
    let rank = getRank.indexOf(getFinal)
    if (member) {
      const template = new DiscordCanvas.Currency()
          .setBackground('#353535')
          .setProfile(member.user.displayAvatarURL({ format: 'png' }) || member.displayAvatarURL({ format: 'png' }))
          .setUsername(member.user.username || member.username)
          .setDiscriminator(member.user.discriminator || member.discriminator)
          .setRank(rank + 1 )
          .setWallet(data.coinsInWallet)
          .setBank(data.coinsInBank)
          .setSeperator('#FFFFFF', 1)

      template.build().then((data) => {
          const attachment = new MessageAttachment(data, 'image-name.png')
          return message.channel.send(attachment)
        })
    } else {
      return embed(message).setError("Укажите участника.").send();
    }



  }
}
