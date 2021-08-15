const {MessageEmbed} = require("discord.js");
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const progressbar = require('string-progressbar');
const embed = require('../../embedConstructor');
const {progressBar} = require("../../functions.js")
const {error} = require('../../functions');

module.exports = {
    config: {
        name: "шип",
        aliases: ['ship'],
        category: 'e_fun',
        description: "Показывает совместимость с участникамии и обычными предметами.",
        usage: "[ник участника | упоминание | ID | какой-то предмет]",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {
      let rand = Math.floor(Math.random() * 100)
      if (!args[0]) return error(message, "Укажите что-то, или кого-то.😂")
      let user = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase());

      if(!user) {
        user = args.join(" ")
        return embed(message).setPrimary(`**Твоя совместимость с _${user}._**\n${progressBar(rand, 100, 10)}`).send()
      }
      return embed(message).setPrimary(`**Любовь между ${message.member} и ${user}**\n${progressBar(rand, 100, 10)}`).send()


    }
}
