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
    name: 'ранг',
    aliases: ['rank'],
    category: 'b_info',
    description: 'Смотреть ранг участника',
    usage: '[участник]',
    acessableby: 'Для всех'
  },
  run: async (bot, message, args) => {
    let server = await serverModel.findOne({serverID: message.guild.id})

    let Embed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
    .setColor(redlight)

    if (!server.rank) return message.channel.send(Embed.setDescription(`**Система уровней для этого сервера отключена!**`)).then(msg => {msg.delete({timeout: "10000"})});

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
    let vip = await vipModel.findOne({userID: user.id})
    if (user.user.bot) return message.channel.send(Embed.setDescription(`**Боты не имеют профиль!**`)).then(msg => {msg.delete({timeout: "10000"})});
    let person = await Levels.fetch(user.id, message.guild.id, true)
    if (!person) return message.channel.send(Embed.setDescription(`**Участник пока не имеет ранг!**`)).then(msg => {msg.delete({timeout: "10000"})});
    let customColor = false;
    if (vip.rankColor !== null){
       let a = vip.rankColor.split("")
       if (a[0] !== "#") {
         a = "#" + vip.rankColor
       } else {
         a = vip.rankColor + ""
       }
       customColor = a
    }
    const rank = new canvacord.Rank()
        .setAvatar(user.user.displayAvatarURL({format: 'jpg', dynamic: false}))
        .setCurrentXP(person.xp, customColor || "#FFFFFF")
        .setRequiredXP(Levels.xpFor(person.level + 1), customColor || "#FFFFFF")
        .setStatus(user.presence.status)
        .setLevel(person.level)
        .setRank(person.position)
        .setLevelColor(customColor || "#FFFFFF", customColor || "#FFFFFF")
        .setRankColor(customColor || "#FFFFFF", customColor || "#FFFFFF")
        .setProgressBar(customColor || "#FFFFFF", "COLOR")
        .setUsername(user.user.username, customColor || "#FFFFFF")
        .setDiscriminator(user.user.discriminator, customColor || "rgba(255, 255, 255, 0.4)")

    if (vip.rankImage !== null) rank.setBackground("IMAGE", vip.rankImage)
    rank.build()
      .then(data => {
          const attachment = new MessageAttachment(data, "RankCard.png");
          message.channel.send(attachment)

      });

    // const led = await Levels.fetchLeaderboard(message.guild.id, 5)
    // if (led.length <1) return message.channel.send("lolol");
    //
    // const gg = await Levels.computeLeaderboard(bot, led, true);
    //
    // const lb = gg.map(e => `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`);
    //
    // message.channel.send(`${lb.join("\n\n")}`)


    //let a = Levels.xpFor(1) = person.level * 400 + 400

  }
}
