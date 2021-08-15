const Discord = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const embed = require('../../embedConstructor');
const {error} = require('../../functions');

module.exports = {
  config: {
    name: "укусить",
    aliases: ['bite', 'кусать'],
    category: 'd_reaction',
    description: "Укусить участника!",
    usage: "[ник участника | упоминание | ID]",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    try {
      const gifs = [
        "https://cdn.discordapp.com/attachments/830878676336902194/830919931322695720/bite1.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830919932044509194/bite2.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830919945549381652/bite8.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830919948472942652/bite5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830919949681033216/bite3.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830919953427333134/bite7.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830919954064867388/bite6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830919955276103730/bite4.gif",
        "https://thumbs.gfycat.com/UniqueThickGalapagosalbatross-size_restricted.gif",
        "https://i.pinimg.com/originals/8f/8a/19/8f8a198638f2f577edcd687533d614c4.gif",
        "https://media1.tenor.com/images/418a2765b0bf54eb57bab3fde5d83a05/tenor.gif?itemid=12151511",
        "https://i.pinimg.com/originals/95/9e/4c/959e4c3712933367c0a553d7a124c925.gif",
      ]
        const random = Math.floor(Math.random() * gifs.length)
        if(!args[0]) return error(message, "Укажи участника чтобы укусить его/ее.");
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return error(message, "Укажи участника чтобы укусить его/ее.");
        if (member.id === message.author.id) return error(message, 'Ты не сможешь укусить себя.');

        const sembed = new Discord.MessageEmbed()
        .setColor(cyan)
        .setDescription(`<@${message.author.id}> укусил(а) <@${member.user.id}>`)
        .setImage(gifs[random])
        .setTimestamp()
        message.channel.send(sembed)
      } catch (e){
        console.log(e);
      }
  }
}
