const {MessageEmbed} = require("discord.js")
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const memberModel = require("../../models/memberSchema");
const serverModel = require("../../models/serverSchema");

module.exports = {
  config: {
    name: "снять-пред",
    description: "Снять предупреждения от участника.",
    usage: "[тег | никнейм | упоминание | ID]",
    category: "a_moderation",
    accessableby: "Нужна права: Управлять сообщениями.",
    aliases: ["unwarn", "снять"]
  },
  run: async (bot, message, args) => {
    let warnEmbed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
    .setColor(redlight)

    let sembed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
    .setColor(greenlight)

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(warnEmbed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});

    if (!args[0]) return message.channel.send(warnEmbed.setDescription("❌ Укажите участника, чтобы снять предупреждения.")).then(msg => {msg.delete({timeout: "10000"})});
    let toWarn = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());

    if(!toWarn || toWarn.id === message.author.id) return message.channel.send(warnEmbed.setDescription("❌ Укажите другого участника, чтобы снять предупреждения.")).then(msg => {msg.delete({timeout: "10000"})});

    let authorHighestRole = message.member.roles.highest.position;
    let mentionHighestRole = toWarn.roles.highest.position;
    if(mentionHighestRole >= authorHighestRole || mentionHighestRole >= message.guild.me.roles.highest.position) {
      return message.channel.send(warnEmbed.setDescription('❌ Вы не сможете снять предупреждения от участника с ролью выше вас, либо себя.')).then(msg => {msg.delete({timeout: "10000"})});
      }

    if (toWarn.user.bot) return message.channel.send(warnEmbed.setDescription("❌ Боты не имеют предупреждения.")).then(msg => {msg.delete({timeout: "10000"})});

    let data = await memberModel.findOne({
      userID: toWarn.id,
      serverID: message.guild.id
    })

    let finlan = data.warns.length;

    if (data && data.warns.length !== 0) {
      let len = data.warns.length;
      await memberModel.findOneAndUpdate({userID: toWarn.id, serverID: message.guild.id}, {$set: {warns: []}})
      message.channel.send(sembed.setDescription(`Сняты все предупреждения с участника ${toWarn} модератором:  ${message.author}`))
    } else if (!data || data.warns.length === 0) {
      let pembed = new MessageEmbed()
      .setTimestamp()
      .setAuthor(toWarn.user.tag, toWarn.user.displayAvatarURL({dynamic: true}))
      .setColor(cyan)
      return message.channel.send(pembed.setDescription(`${toWarn} не имеет предупреждений.`))
    }

    let sd = await serverModel.findOne({serverID: message.guild.id})
    let channel = sd.modLog;
    if (!channel) return;

    let embed = new MessageEmbed()
          .setColor(redlight)//
          .setThumbnail(toWarn.user.displayAvatarURL({ dynamic: true }))
          .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
          .addField("**Модерация**", "Снятие Предупреждений")
          .addField("**Участник**", toWarn.user.username)
          .addField("**Модератор**", message.author.username)
          .addField("**Кол-во предупреждений**", finlan)
          .addField("**Дата**", message.createdAt.toLocaleString())
          .setFooter(message.member.displayName, message.author.displayAvatarURL())
          .setTimestamp()

      var sChannel = message.guild.channels.cache.get(channel)
      if (!sChannel) return;
      sChannel.send(embed)
  }
}
