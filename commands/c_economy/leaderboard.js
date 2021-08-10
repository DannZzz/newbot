const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const mc = require('discordjs-mongodb-currency');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const db = require("mongoose");
let profileModel = require("../../models/profileSchema.js")
const commaNumber = require("comma-number");

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

    const leaderboard = await mc.generateLeaderboard(message.guild.id, 10);

    if (leaderboard.length < 1) return message.channel.send("Тут никого нет.");

    const mappedLeaderboard = leaderboard.map((i, p = 0)=> {

      return `${p+1}. <@!${i.userId}> - ${i.coinsInWallet}`
    });

    const embed = new MessageEmbed()
    .setTitle(`Топ - ${message.guild.name}`)
    .setColor(cyan)
    .setTimestamp()
    .setDescription(`${mappedLeaderboard.join('\n')}`);

    message.channel.send(embed);

  }
}
