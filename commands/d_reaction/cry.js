const Discord = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "плакать",
    aliases: ['cry'],
    category: 'd_reaction',
    description: "Плакать..Эх.",
    usage: "",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    try {
      const gifs = [
        "https://cdn.discordapp.com/attachments/830878676336902194/830920948882341958/cry2.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830920956134162482/cry3.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830920974668136498/cry4.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830920976446521344/cry5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830920992753975357/cry8.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830920992544129055/cry9.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830920997297193010/cry7.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830920999917846538/cry6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830921165328875560/cry1.gif",
        "https://media2.giphy.com/media/ROF8OQvDmxytW/200.gif",
        "https://64.media.tumblr.com/ff4cd3b113ac1f5ae84f2a2af46fa3ec/7f2f842db72c1440-d2/s540x810/0d4328e978774ba658be543ee00b725729377e6f.gif",
        "https://i.pinimg.com/originals/6b/d7/38/6bd73801b4f4eff060238e39a523505f.gif",
        "https://i2.wp.com/data.whicdn.com/images/308584789/original.gif",
        "https://i.pinimg.com/originals/f2/81/cf/f281cf3d5b1f4ae5058ff1aabbabf7d5.gif"
      ]
      let m;
      let member;
      if(args[0]) {
      member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
      if(member) {m = `<@${message.author.id}> расплакался(алась) из-за <@${member.user.id}>.`}
      else {m = `<@${message.author.id}> расплакался(алась).`}
    } else {m = `<@${message.author.id}> расплакался(алась).`}

        const random = Math.floor(Math.random() * gifs.length)
        const sembed = new Discord.MessageEmbed()
        .setColor(cyan)
        .setDescription(m)
        .setImage(gifs[random])
        .setTimestamp()
        message.channel.send(sembed)
      } catch (e){
        console.log(e);
      }
  }
}
