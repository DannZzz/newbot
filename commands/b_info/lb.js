const profileModel = require("../../models/profileSchema");
const memberModel = require("../../models/memberSchema");
const begModel = require("../../models/begSchema");
const canvacord = require("canvacord");
const { MessageEmbed, MessageAttachment } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR, MONGO } = require('../../config');
const vipModel = require("../../models/vipSchema");
const serverModel = require("../../models/serverSchema");
const Embed = require('../../embedConstructor');
const pagination = require('discord.js-pagination')

const Levels = require("discord-xp");
Levels.setURL(MONGO);


module.exports = {
  config: {
    name: 'ранги',
    aliases: ['ranks'],
    category: 'b_info',
    description: 'Посмотреть топ активных участников.',
    usage: '',
    acessableby: 'Для всех'
  },
  run: async (bot, message, args) => {
    let server = await serverModel.findOne({serverID: message.guild.id})

    let embed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(`${message.guild.name}\nТоп 10 активных участников!`, message.guild.iconURL({dynamic: true}))
    .setColor(cyan)

    if (!server.rank) return Embed(message).setError(`**Система уровней для этого сервера отключена!**`).send().then(msg => {msg.delete({timeout: "10000"})});

    const led = await Levels.fetchLeaderboard(message.guild.id, 30)
    if (led.length <1) return Embed(message).setError(`**Тут пока никого нет.**`).send().then(msg => {msg.delete({timeout: "10000"})});


    const gg = await Levels.computeLeaderboard(bot, led, true);

    const lb = gg.map(e => `${e.position}. ${e.username}#${e.discriminator}\nУровень: ${e.level}\nОпыт: ${e.xp.toLocaleString()}`);

    let as;
    let page1;
    let page2;
    let page3;
    if(led.length <= 10) {
      as = lb.slice(0, 10).join("\n\n")
      message.channel.send(embed.setDescription("\`\`\`" + as + "\`\`\`")).then(msg => {msg.delete({timeout: "100000"})});
    } else {
      if (led.length <= 20){
        page1 =  new MessageEmbed()
        .setDescription("\`\`\`" + lb.slice(0, 10).join("\n\n") + "\`\`\`")
        .setColor(cyan)
        .setTimestamp()
        page2 =  new MessageEmbed()
        .setDescription("\`\`\`" + lb.slice(10, 20).join("\n\n") + "\`\`\`")
        .setColor(cyan)
        .setTimestamp()
      } else if (led.length <= 30) {
        page1 =  new MessageEmbed()
        .setDescription("\`\`\`" + lb.slice(0, 10).join("\n\n") + "\`\`\`")
        .setColor(cyan)
        .setTimestamp()
        page2 =  new MessageEmbed()
        .setDescription("\`\`\`" + lb.slice(10, 20).join("\n\n") + "\`\`\`")
        .setColor(cyan)
        .setTimestamp()
        page3 =  new MessageEmbed()
        .setDescription("\`\`\`" + lb.slice(20, 30).join("\n\n") + "\`\`\`")
        .setColor(cyan)
        .setTimestamp()
      }
      let pages = [page1, page2, page3]
      if(!page3) { pages = [
        page1.setAuthor(`${message.guild.name}\nТоп 20 активных участников!`, message.guild.iconURL({dynamic: true})),
        page2.setAuthor(`${message.guild.name}\nТоп 20 активных участников!`, message.guild.iconURL({dynamic: true}))
      ] } else { pages = [page1.setAuthor(`${message.guild.name}\nТоп 30 активных участников!`, message.guild.iconURL({dynamic: true})),
        page2.setAuthor(`${message.guild.name}\nТоп 30 активных участников!`, message.guild.iconURL({dynamic: true})),
        page3.setAuthor(`${message.guild.name}\nТоп 30 активных участников!`, message.guild.iconURL({dynamic: true}))] }

      const emojies = ["⬅", "➡"]

      const timeout = '100000'

      pagination(message, pages, emojies, timeout)
    }


  }
}
