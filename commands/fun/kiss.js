const Discord = require('discord.js');
const superagent = require('superagent');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');

module.exports = {
  config: {
    name: "поцеловать",
    aliases: ['поц', 'kiss'],
    category: 'fun',
    description: "Поцелуй, давай!",
    usage: "[ник участника | упоминание | ID]",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    try {
        let embed = new Discord.MessageEmbed()
        .setColor(redlight)
        .setTimestamp()
        .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
        if(!args[0]) return message.channel.send(embed.setDescription("Укажи участника чтобы поцеловать его/ее.")).then(msg => {msg.delete({timeout: "10000"})});
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return message.channel.send(embed.setDescription("Укажи участника чтобы поцеловать его/ее.")).then(msg => {msg.delete({timeout: "10000"})});
        if (member.id === message.author.id) return message.channel.send(embed.setDescription('Ты не сможешь поцеловать себя.')).then(msg => {msg.delete({timeout: "10000"})});
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
