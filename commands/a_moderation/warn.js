const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const memberModel = require("../../models/memberSchema");
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');
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

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});

    if (!args[0]) return embed(message).setError("Укажите участника, чтобы давать предупреждение.").send().then(msg => {msg.delete({timeout: "10000"})});
    let toWarn = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());

    if(!toWarn || toWarn.id === message.author.id) return embed(message).setError("Укажите другого участника, чтобы давать предупреждение.").send().then(msg => {msg.delete({timeout: "10000"})});

    let authorHighestRole = message.member.roles.highest.position;
    let mentionHighestRole = toWarn.roles.highest.position;
    if(mentionHighestRole >= authorHighestRole || mentionHighestRole >= message.guild.me.roles.highest.position) {
      return embed(message).setError('Вы не сможете давать предупреждение участнику с ролью выше вас, либо себя.').send().then(msg => {msg.delete({timeout: "10000"})});
      }

    if (toWarn.user.bot) return embed(message).setError("Невозможно давать предупреждение ботам.").send().then(msg => {msg.delete({timeout: "10000"})});

    let data = await memberModel.findOne({
      userID: toWarn.id,
      serverID: message.guild.id
    })

    let reason = args.slice(1).join(" ")

    if (!reason) return embed(message).setError("Укажите причину.").send().then(msg => {msg.delete({timeout: "10000"})});

    if (data) {
      data.warns.unshift({
        Moderator: message.author.id,
        Reason: reason,
        Date: message.createdAt.toLocaleString('ru-ru', {timeZone: 'Europe/Moscow'})
      });
      data.save()

      embed(message).setSuccess(`${toWarn} получил(а) предупреждение от ${message.author} по причине: \`\`${reason}\`\``).send();
    } else if (!data) {
      let newData = await memberModel.create({
        userID: toWarn.id,
        serverID: message.guild.id,
        warns: [{
          Moderator: message.author.id,
          Reason: reason,
          Date: message.createdAt.toLocaleString('ru-ru', {timeZone: 'Europe/Moscow'})
        }, ],
      });
      newData.save()

      embed(message).setSuccess(`${toWarn} получил(а) предупреждение от ${message.author} по причине: \`\`${reason}\`\``).send();
    }

    let sd = await serverModel.findOne({serverID: message.guild.id})
    let channel = sd.modLog;
    if (!channel) return;

    let aaembed = new MessageEmbed()
          .setColor(redlight)
          .setThumbnail(toWarn.user.displayAvatarURL({ dynamic: true }))
          .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
          .addField("**Модерация**", "Предупреждение")
          .addField("**Участник**", toWarn.user.tag)
          .addField("**Модератор**", message.author.tag)
          .addField("**Причина**", `${reason || "**Нет причины**"}`)
          .setFooter("Дата")
          .setTimestamp()

      var sChannel = message.guild.channels.cache.get(channel)
      if (!sChannel) return;
      sChannel.send(aaembed)
  }
}
