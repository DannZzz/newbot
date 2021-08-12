const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const mc = require('discordjs-mongodb-currency');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const db = require("mongoose");
let profileModel = require("../../models/profileSchema.js")
const commaNumber = require("comma-number");
const mongoose = require("mongoose")

module.exports = {
    config: {
        name: "топ",
        aliases: ['lb', "top", "лидеры"],
        category: 'c_economy',
        description: 'Показывает топ 15 богатых участников по банку сервера.',
        usage: '',
        accessableby: "Для всех"
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

      const getTop = await asd.find({guildId: message.guild.id}).sort([['coinsInBank', 'descending']]).exec();

      const leaderboard = getTop.slice(0, 15);


      if (leaderboard.length < 1) return message.channel.send("Тут никого нет.");
    // const leaderboard = await mc.generateLeaderboard(message.guild.id, 10);
    //
    // if (leaderboard.length < 1) return message.channel.send("Тут никого нет.");
    //
    const mappedLeaderboard = leaderboard.map((i, p = 0)=> {

      return `\`\`${p+1}. ${bot.users.cache.get(i.userId) ? `**${bot.users.cache.get(i.userId).username}**\`\`#${bot.users.cache.get(i.userId).discriminator}\`\`` : `**Неизвестный**\`\`#0000\`\``} — \`\`${i.coinsInBank}\`\` <a:danndollar:875448360830644225>`});

    const embed = new MessageEmbed()
    .setTitle(`Топ 15 — ${message.guild.name}`)
    .setColor(cyan)
    .setTimestamp()
    .setDescription(`${mappedLeaderboard.join('\n')}`);

    message.channel.send(embed);

  }
}
