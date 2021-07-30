const Discord = require('discord.js');
const superagent = require('superagent');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "шлепнуть",
    aliases: ['шлеп', 'slap'],
    category: 'd_reaction',
    description: "Шлепнуть участника.",
    usage: "[ник участника | упоминание | ID]",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    try {

        if(!args[0]) return embed(message).setError("Укажи участника чтобы шлепнуть его/ее.").send().then(msg => {msg.delete({timeout: "10000"})});
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return embed(message).setError("Укажи участника чтобы шлепнуть его/ее.").send().then(msg => {msg.delete({timeout: "10000"})});
        if (member.id === message.author.id) return embed(message).setError('Ты не сможешь шлепнуть себя.').send().then(msg => {msg.delete({timeout: "10000"})});
        const { body } = await superagent
        .get("https://nekos.life/api/v2/img/slap");

        const sembed = new Discord.MessageEmbed()
        .setColor(cyan)
        .setDescription(`UwU, <@${message.author.id}> шлепнул(а) <@${member.user.id}>`)
        .setImage(body.url)
        .setTimestamp()
        message.channel.send(sembed)
      } catch (e){
        console.log(e);
      }
  }
}
