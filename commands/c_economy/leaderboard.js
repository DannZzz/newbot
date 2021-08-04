const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

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
    let msg = await message.channel.send("**Секунду**");
    const users = await profileModel.find()

    const lb = users
              .slice(0)
              .sort(({ bank: a }, { bank: b }) => b - a)
              .splice(0, 15)
              .filter(
                function({userID}) {
                  let guild = bot.guilds.cache.get(message.guild.id)

                  let is =  guild.member(userID);
                  return guild.members.cache.find(mem => mem === is)


                }
              )
              .map(

                ({ userID, bank }, pos) => `__${pos + 1}.__ <@${userID}> - **${commaNumber(bank)}** ${COIN}`
              )



          const newnew =     lb.splice(0, 15)
            const embed = new MessageEmbed()
              .setTitle('Самые богатые участники по Банку - Top 15')
              .setDescription(newnew)
              .setColor('RANDOM')
    message.channel.send(embed)
    msg.delete()
  }
}
