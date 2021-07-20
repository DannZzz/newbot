const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const db = require("mongoose");
let profileModel = require("../../profileSchema.js")
const commaNumber = require("comma-number");

module.exports = {
    config: {
        name: "топ",
        aliases: ['lb', "top", "лидеры"],
        category: 'c_economy',
        description: 'Показывает топ 10 богатых участников по банку сервера.',
        usage: ' ',
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {
    let msg = await message.channel.send("**Секунду**");
    const users = await profileModel.find()

    const lb = users
              .slice(0)
              .sort(({ bank: a }, { bank: b }) => b - a)
              .slice(0, 16)
              .filter(
                function({userID}) {
                  let guild = bot.guilds.cache.get(message.guild.id)

                  let is =  guild.member(userID);
                  let a = guild.members.cache.find(mem => mem === is)
                  return bot.users.cache.find(mem => mem.id === a).user.username

                }
              )
              .map(

                ({ userID, bank }, pos) => `__${pos + 1}.__ <@${userID}> - **${commaNumber(bank)}** ${COIN}`
              )



          const newnew =     lb.slice(0, 16)
            const embed = new MessageEmbed()
              .setTitle('Самые богатые участники по Банку - Top 15')
              .setDescription(newnew)
              .setColor('RANDOM')
    message.channel.send(embed)
    msg.delete()
  }
}
