const Discord = require('discord.js');
const superagent = require('superagent');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');


module.exports = {
  config: {
    name: "кот",
    aliases: ['котик', 'cat'],
    category: 'e_fun',
    description: "Выдает рандомную фоточку кота!",
    usage: "",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {

        const { body } = await superagent
        .get("http://aws.random.cat/meow");

        const sembed = new Discord.MessageEmbed()
        .setColor(cyan)
        .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
        .setDescription(`Вот тебе котик🐱`)
        .setImage(body.file)
        .setTimestamp()
        message.channel.send(sembed)

  }
}
