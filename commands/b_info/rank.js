const canvacord = require("canvacord");
const { MessageEmbed, MessageAttachment } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR, MONGO } = require('../../config');
const vipModel = require("../../models/vipSchema");
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');
const {error} = require('../../functions');

const Levels = require("discord-xp");
Levels.setURL(MONGO);


module.exports = {
  config: {
    name: 'ранг',
    aliases: ['rank'],
    category: 'b_info',
    description: 'Посмотреть ранг участника по активности.',
    usage: '[участник]',
    acessableby: 'Для всех'
  },
  run: async (bot, message, args) => {
    let server = await serverModel.findOne({serverID: message.guild.id})

    if (!server.rank) return error(message, `Система уровней для этого сервера отключена!`);

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
    let vip = await vipModel.findOne({userID: user.id})
    if (user.user.bot) return error(message, `Боты не имеют профиль!`);
    let person = await Levels.fetch(user.id, message.guild.id, true)
    if (!person) return error(message, `Участник пока не имеет ранг!`);
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
    let nowLevelToReq = Levels.xpFor(person.level + 1) - Levels.xpFor(person.level)
    let nowLevelToZero = person.xp - Levels.xpFor(person.level)
    const rank = new canvacord.Rank()
        .setAvatar(user.user.displayAvatarURL({format: 'jpg', dynamic: false}))
        .setCurrentXP(nowLevelToZero, customColor || "#FFFFFF")
        .setRequiredXP(nowLevelToReq, customColor || "#FFFFFF")
        .setStatus(user.presence.status, true)
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
