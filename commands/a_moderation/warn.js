const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const memberModel = require("../../models/memberSchema");
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');
const {error} = require('../../functions');

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

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return error(message, "У вас недостаточно прав.");

    if (!args[0]) return error(message, "Укажите участника, чтобы давать предупреждение.");
    let toWarn = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());

    if(!toWarn || toWarn.id === message.author.id) return error(message, "Укажите другого участника, чтобы давать предупреждение.");

    let authorHighestRole = message.member.roles.highest.position;
    let mentionHighestRole = toWarn.roles.highest.position;
    if(mentionHighestRole >= authorHighestRole || mentionHighestRole >= message.guild.me.roles.highest.position) {
      return error(message, 'Вы не сможете давать предупреждение участнику с ролью выше вас, либо себя.');
      }

    if (toWarn.user.bot) return error(message, "Невозможно давать предупреждение ботам.");

    let data = await memberModel.findOne({
      userID: toWarn.id,
      serverID: message.guild.id
    })

    let reason = args.slice(1).join(" ")

    if (!reason) return error(message, "Укажите причину.");

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
