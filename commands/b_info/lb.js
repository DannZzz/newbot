const profileModel = require("../../models/profileSchema");
const memberModel = require("../../models/memberSchema");
const begModel = require("../../models/begSchema");
const canvacord = require("canvacord");
const { MessageEmbed, MessageAttachment } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR, MONGO } = require('../../config');
const vipModel = require("../../models/vipSchema");
const serverModel = require("../../models/serverSchema");

const Levels = require("discord-xp");
Levels.setURL(MONGO);


module.exports = {
  config: {
    name: 'ранги',
    aliases: ['ranks'],
    category: 'b_info',
    description: 'Смотреть топ 10 участников.',
    usage: '',
    acessableby: 'Для всех'
  },
  run: async (bot, message, args) => {
    let server = await serverModel.findOne({serverID: message.guild.id})

    let Embed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
    .setColor(redlight)

    let embed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(`${message.guild.name}\nТоп 10 активных участников!`, message.guild.iconURL({dynamic: true}))
    .setColor(cyan)

    if (!server.rank) return message.channel.send(Embed.setDescription(`**❌ Система уровней для этого сервера отключена!**`)).then(msg => {msg.delete({timeout: "10000"})});

    const led = await Levels.fetchLeaderboard(message.guild.id, 10)
    if (led.length <1) return message.channel.send(Embed.setDescription(`**❌ Тут пока никого нет.**`)).then(msg => {msg.delete({timeout: "10000"})});


    const gg = await Levels.computeLeaderboard(bot, led, true);

    const lb = gg.map(e => `\`\`\`${e.position}. ${e.username}#${e.discriminator} -- Уровень: ${e.level} -- XP: ${e.xp.toLocaleString()}\`\`\``);
    let as = lb.join("")
    message.channel.send(embed.setDescription(as))

  }
}
