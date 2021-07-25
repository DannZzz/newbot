const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const memberModel = require("../../models/memberSchema");
const serverModel = require("../../models/serverSchema");

module.exports = {
  config: {
    name: "пред",
    description: "Давать предупреждение участнику.",
    usage: "[тег | никнейм | упоминание | ID] [причина]",
    category: "a_moderation",
    accessableby: "Нужна права: Управлять сообщениями.",
    aliases: ["warn"]
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

    if (!args[0]) return message.channel.send(warnEmbed.setDescription("❌ Укажите участника, чтобы давать предупреждение.")).then(msg => {msg.delete({timeout: "10000"})});
    let toWarn = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());

    if(!toWarn || toWarn.id === message.author.id) return message.channel.send(warnEmbed.setDescription("❌ Укажите другого участника, чтобы давать предупреждение.")).then(msg => {msg.delete({timeout: "10000"})});

    let authorHighestRole = message.member.roles.highest.position;
    let mentionHighestRole = toWarn.roles.highest.position;
    if(mentionHighestRole >= authorHighestRole || mentionHighestRole >= message.guild.me.roles.highest.position) {
      return message.channel.send(warnEmbed.setDescription('❌ Вы не сможете давать предупреждение участнику с ролью выше вас, либо себя.')).then(msg => {msg.delete({timeout: "10000"})});
      }

    if (toWarn.user.bot) return message.channel.send(warnEmbed.setDescription("❌ Невозможно давать предупреждение ботам.")).then(msg => {msg.delete({timeout: "10000"})});

    let data = await memberModel.findOne({
      userID: toWarn.id,
      serverID: message.guild.id
    })

    let reason = args.slice(1).join(" ")

    if (!reason) return message.channel.send(warnEmbed.setDescription("❌ Укажите причину.")).then(msg => {msg.delete({timeout: "10000"})});

    if (data) {
      data.warns.unshift({
        Moderator: message.author.id,
        Reason: reason,
      });
      data.save()

      message.channel.send(sembed.setDescription(`${toWarn} получил(а) предупреждение от ${message.author} по причине: \`\`${reason}\`\``))
    } else if (!data) {
      let newData = await memberModel.create({
        userID: toWarn.id,
        serverID: message.guild.id,
        warns: [{
          Moderator: message.author.id,
          Reason: reason,
        }, ],
      });
      newData.save()

      message.channel.send(sembed.setDescription(`${toWarn} получил(а) предупреждение от ${message.author} по причине: \`\`${reason}\`\``))
    }

    let sd = await serverModel.findOne({serverID: message.guild.id})
    let channel = sd.modLog;
    if (!channel) return;

    let embed = new MessageEmbed()
          .setColor(redlight)
          .setThumbnail(toWarn.user.displayAvatarURL({ dynamic: true }))
          .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
          .addField("**Модерация**", "Предупреждение")
          .addField("**Участник**", toWarn.user.username)
          .addField("**Модератор**", message.author.username)
          .addField("**Причина**", `${reason || "**Нет причины**"}`)
          .addField("**Дата**", message.createdAt.toLocaleString())
          .setFooter(message.member.displayName, message.author.displayAvatarURL())
          .setTimestamp()

      var sChannel = message.guild.channels.cache.get(channel)
      if (!sChannel) return;
      sChannel.send(embed)
  }
}
