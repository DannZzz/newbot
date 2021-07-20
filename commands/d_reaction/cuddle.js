const Discord = require('discord.js');
const superagent = require('superagent');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const nekoclient = require('nekos.life');
const neko = new nekoclient();

module.exports = {
  config: {
    name: "прижать",
    aliases: ['cuddle'],
    category: 'd_reaction',
    description: "Прижать участника.",
    usage: "[ник участника | упоминание | ID]",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    try {
        let embed = new Discord.MessageEmbed()
        .setColor(redlight)
        .setTimestamp()
        .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
        if(!args[0]) return message.channel.send(embed.setDescription("Укажи участника чтобы покормить его/ее.")).then(msg => {msg.delete({timeout: "10000"})});
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return message.channel.send(embed.setDescription("Укажи участника чтобы покормить его/ее.")).then(msg => {msg.delete({timeout: "10000"})});
        if (member.id === message.author.id) return message.channel.send(embed.setDescription('Ты не сможешь покормить себя.')).then(msg => {msg.delete({timeout: "10000"})});
        const GIF = await neko.sfw.cuddle();

        const sembed = new Discord.MessageEmbed()
        .setColor(cyan)
        .setDescription(`Хм, <@${message.author.id}> прижала(а) <@${member.user.id}> к себе!`)
        .setImage(GIF.url)
        .setTimestamp()
        message.channel.send(sembed)
      } catch (e){
        console.log(e);
      }
  }
}
