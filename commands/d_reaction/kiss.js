const Discord = require('discord.js');
const superagent = require('superagent');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const embed = require('../../embedConstructor');
const {error} = require('../../functions');

module.exports = {
  config: {
    name: "поцеловать",
    aliases: ['поц', 'kiss'],
    category: 'd_reaction',
    description: "Поцелуй, давай!",
    usage: "[ник участника | упоминание | ID]",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    try {

        if(!args[0]) return error(message, "Укажи участника чтобы поцеловать его/ее.");
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return error(message, "Укажи участника чтобы поцеловать его/ее.");
        if (member.id === message.author.id) return error(message, 'Ты не сможешь поцеловать себя.');
        const { body } = await superagent
        .get("https://nekos.life/api/kiss");

        const sembed = new Discord.MessageEmbed()
        .setColor(cyan)
        .setDescription(`Опа, <@${message.author.id}> поцеловал(а) <@${member.user.id}>`)
        .setImage(body.url)
        .setTimestamp()
        message.channel.send(sembed)
      } catch (e){
        console.log(e);
      }
  }
}
