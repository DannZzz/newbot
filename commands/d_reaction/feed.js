const Discord = require('discord.js');
const superagent = require('superagent');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const nekoclient = require('nekos.life');
const neko = new nekoclient();
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "покормить",
    aliases: ['feed'],
    category: 'd_reaction',
    description: "Покормить участника.",
    usage: "[ник участника | упоминание | ID]",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    try {
        if(!args[0]) return embed(message).setError("Укажи участника чтобы покормить его/ее.").send().then(msg => {msg.delete({timeout: "10000"})});
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return embed(message).setError("Укажи участника чтобы покормить его/ее.").send().then(msg => {msg.delete({timeout: "10000"})});
        if (member.id === message.author.id) return embed(message).setError('Ты не сможешь покормить себя.').send().then(msg => {msg.delete({timeout: "10000"})});
        const GIF = await neko.sfw.feed();

        const sembed = new Discord.MessageEmbed()
        .setColor(cyan)
        .setDescription(`UwU, <@${message.author.id}> покормил(а) <@${member.user.id}>`)
        .setImage(GIF.url)
        .setTimestamp()
        message.channel.send(sembed)
      } catch (e){
        console.log(e);
      }
  }
}
