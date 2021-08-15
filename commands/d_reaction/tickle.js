const Discord = require('discord.js');
const superagent = require('superagent');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const nekoclient = require('nekos.life');
const neko = new nekoclient();
const embed = require('../../embedConstructor');
const {error} = require('../../functions');


module.exports = {
  config: {
    name: "щекотать",
    aliases: ['tickle'],
    category: 'd_reaction',
    description: "Щекотать участника.",
    usage: "[ник участника | упоминание | ID]",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    try {

        if(!args[0]) return error(message, "Укажи участника чтобы пощекотать его/ее.");
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return error(message, "Укажи участника хчтобы пощекотать его/ее.");
        if (member.id === message.author.id) return error(message, 'Ты не сможешь пощекотать себя.');
        const GIF = await neko.sfw.tickle();

        const sembed = new Discord.MessageEmbed()
        .setColor(cyan)
        .setDescription(`Хех, <@${message.author.id}> пощекотал(а) <@${member.user.id}>!`)
        .setImage(GIF.url)
        .setTimestamp()
        message.channel.send(sembed)
      } catch (e){
        console.log(e);
      }
  }
}
