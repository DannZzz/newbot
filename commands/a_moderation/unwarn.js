const {MessageEmbed} = require("discord.js")
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const {PREFIX, AGREE} = require("../../config");
const memberModel = require("../../models/memberSchema");
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');
const {error} = require('../../functions');

module.exports = {
  config: {
    name: "снять-пред",
    description: "Снять предупреждения от участника.",
    usage: "[тег | никнейм | упоминание | ID] (номер предупреждений)",
    category: "a_moderation",
    accessableby: "Нужна права: Управлять сообщениями.",
    aliases: ["unwarn", "снять"]
  },
  run: async (bot, message, args) => {

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return error(message, "У вас недостаточно прав.")

    if (!args[0]) return error(message, "Укажите участника, чтобы снять предупреждения.")
    let toWarn = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());

    if(!toWarn || toWarn.id === message.author.id) return error(message, "Укажите другого участника, чтобы снять предупреждения.")

    let authorHighestRole = message.member.roles.highest.position;
    let mentionHighestRole = toWarn.roles.highest.position;
    if(mentionHighestRole >= authorHighestRole || mentionHighestRole >= message.guild.me.roles.highest.position) {
      return error(message, 'Вы не сможете снять предупреждения от участника с ролью выше вас, либо себя.')
      }

    if (toWarn.user.bot) return error(message, "Боты не имеют предупреждения.")

    let data = await memberModel.findOne({
      userID: toWarn.id,
      serverID: message.guild.id
    })

    let finlan = data.warns.length;

    if (data && data.warns.length !== 0) {
      if(!args[1] || isNaN(args[1])) {
      let len = data.warns.length;
      await memberModel.findOneAndUpdate({userID: toWarn.id, serverID: message.guild.id}, {$set: {warns: []}})
      embed(message).setSuccess(`Сняты все предупреждения с участника ${toWarn} модератором:  ${message.author}`).send();
    } else if (args[1] > data.warns.length) {
      error(message, 'Предупреждение не найдено.');
    } else {
      finlan = 1
      let a = args[1] - 1;
      data.warns.splice(a, 1)
      data.save()
      embed(message).setSuccess('Предупреждение успешно снято.').send()
    }
    } else if (!data || data.warns.length === 0) {
      let pembed = new MessageEmbed()
      .setTimestamp()
      .setAuthor(toWarn.user.tag, toWarn.user.displayAvatarURL({dynamic: true}))
      .setColor(cyan)
      return message.channel.send(pembed.setDescription(`${AGREE} ${toWarn} не имеет предупреждений.`))
    }

    let sd = await serverModel.findOne({serverID: message.guild.id})
    let channel = sd.modLog;
    if (!channel) return;

    let aaembed = new MessageEmbed()
          .setColor(redlight)//
          .setThumbnail(toWarn.user.displayAvatarURL({ dynamic: true }))
          .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
          .addField("**Модерация**", "Снятие Предупреждений")
          .addField("**Участник**", toWarn.user.tag)
          .addField("**Модератор**", message.author.tag)
          .addField("**Кол-во предупреждений**", finlan)
          .setFooter("Дата")
          .setTimestamp()

      var sChannel = message.guild.channels.cache.get(channel)
      if (!sChannel) return;
      sChannel.send(aaembed)
  }
}
