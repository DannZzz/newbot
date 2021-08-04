const Discord = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "тыкать",
    aliases: ['poke', 'тык'],
    category: 'd_reaction',
    description: "Тыкнуть участника!",
    usage: "[ник участника | упоминание | ID]",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    try {
      const gifs = [
        "https://i.kym-cdn.com/photos/images/original/000/674/446/346.gif",
        "https://i2.wp.com/media1.tenor.com/images/68a4dd239a1103ae266f4197e8a40c01/tenor.gif",
        "https://i.gifer.com/JTSO.gif",
        "https://i.giphy.com/media/l46Cao9ra1WUA4f6M/giphy.webp",
        "https://i.kym-cdn.com/photos/images/newsfeed/000/943/107/c7e.gif",
        "https://1.bp.blogspot.com/-0cu-3g3bio4/Vx_hCIRUcYI/AAAAAAAAcE8/mcV22O8uolst5z3Rd-reMOPhxoLLMeXaACKgB/s1600/Omake%2BGif%2BAnime%2B-%2BKuma%2BMiko%2B-%2BEpisode%2B4%2B-%2BMachi%2BCheek%2BPoke.gif",
        "https://i.imgur.com/MuHTLun.gif",
        "https://media.tenor.com/images/d07762ab2f5fc5d1d43525d2b3db7de8/tenor.gif",
        "https://i.pinimg.com/originals/40/54/5c/40545c887023ba16e26f094bdb335271.gif",
        "https://monophy.com/media/aZSMD7CpgU4Za/monophy.gif",
        "https://i.gifer.com/Rd88.gif",
        "https://i.pinimg.com/originals/ae/62/32/ae62324b1de9d2422a45557ac0551e48.gif",
      ]
        const random = Math.floor(Math.random() * gifs.length)
        if(!args[0]) return embed(message).setError("Укажи участника чтобы тикнуть его/ее.").send().then(msg => {msg.delete({timeout: "10000"})});
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return embed(message).setError("Укажи участника чтобы тикнуть его/ее.").send().then(msg => {msg.delete({timeout: "10000"})});
        if (member.id === message.author.id) return embed(message).setError('Ты не сможешь тикнуть себя.').send().then(msg => {msg.delete({timeout: "10000"})});

        const sembed = new Discord.MessageEmbed()
        .setColor(cyan)
        .setDescription(`<@${message.author.id}> тикнул(а) <@${member.user.id}>`)
        .setImage(gifs[random])
        .setTimestamp()
        message.channel.send(sembed)
      } catch (e){
        console.log(e);
      }
  }
}
