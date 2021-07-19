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
        category: 'economy',
        description: 'Показывает топ 10 богатых участников по банку сервера.',
        usage: ' ',
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {
    let msg = await message.channel.send("**Секунду**");
    const users = await profileModel.find({serverID: message.guild.id})
    const userss = await profileModel.find()

    const lbb = userss
              .slice(0)
              .sort(({ bank: a }, { bank: b }) => b - a)
              .map(

                ({ userID, bank }, pos) => `__${pos + 1}.__ <@${userID}> - **${commaNumber(bank)}** ${COIN}`,
              );
    const lb = users
              .slice(0)
              .sort(({ bank: a }, { bank: b }) => b - a)
              .map(

                ({ userID, bank }, pos) => `__${pos + 1}.__ <@${userID}> - **${commaNumber(bank)}** ${COIN}`,
              );

          const newnew =     lb.slice(0, 10)
            const news =     lb.slice(0, 15)
            const embed = new MessageEmbed()
              .setTitle('Самые богатые участники по Банку - Top 10')
              .setDescription(newnew)
              .addField("Глобальный топ по Банку - Top 15", news, true)
              .setColor('RANDOM')
    message.channel.send(embed)
    msg.delete()
  }
}
