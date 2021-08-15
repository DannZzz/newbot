const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");
const {error} = require('../../functions');

module.exports = {
  config: {
    name: "размьют",
    description: "Размьютить участника.",
    usage: "[тег | никнейм | упоминание | ID]",
    category: "a_moderation",
    accessableby: "Нужна права: Управлять сообщениями.",
    aliases: ["unmute", "um", "рм"]
  },
  run: async (bot, message, args) => {
    try {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return error(message, "У вас недостаточно прав.");;
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) return error(message, "У меня недостаточно прав.");;

      if (!args[0]) return error(message, "Укажите участника, чтобы размьютить.");
      var mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
      let sd = await serverModel.findOne({ serverID: message.guild.id });
      if (!mutee) return error(message, "Укажите участника.");;

      if (mutee === message.member) return error(message, "Невозможно размьютить себя.");
      if (mutee.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return error(message, "Невозможно размьютить этого участника.");;
      let authorHighestRole = message.member.roles.highest.position;
      let mentionHighestRole = mutee.roles.highest.position;
      if(mentionHighestRole >= authorHighestRole) {
        error(message, 'Вы не сможете размутить участника с ролью выше вас, либо себя.');;
        return;}
      let reason = args.slice(1).join(" ");
      if (mutee.user.bot) return error(message, "Невозможно размьютить ботов.");;
      const userRoles = mutee.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r.id)

      let muterole;
      let dbmute = sd.muteRole;
      let muteerole = message.guild.roles.cache.find(r => r.name === "Замучен")

      if (!message.guild.roles.cache.has(dbmute)) {
        muterole = muteerole
      } else {
        muterole = message.guild.roles.cache.get(dbmute)
      }

      if (!mutee.roles.cache.has(muterole.id))  return error(message, "Этот участник уже размучен.");

      if (reason) {
                  const sembed2 = new MessageEmbed()
                  .setColor(greenlight)
                  .setTimestamp()
                  .setAuthor(message.guild.name, message.guild.iconURL())
                  .setDescription(`${AGREE} <@${mutee.id}> успешно размучен, по причине: \`${reason}\`.`)
                  mutee.roles.remove(muterole);
                  message.channel.send(sembed2);
                } else {
                    const sembed2 = new MessageEmbed()
                    .setColor(greenlight)
                    .setTimestamp()
                    .setAuthor(message.guild.name, message.guild.iconURL())
                    .setDescription(`${AGREE} <@${mutee.id}> успешно размучен.`)
                mutee.roles.remove(muterole);
                message.channel.send(sembed2);
                }

      let channel = sd.modLog;
      if (!channel) return;

      let aaembed = new MessageEmbed()
            .setColor(redlight)
            .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
            .addField("**Модерация**", "Размьют")
            .addField("**Участник**", mutee.user.tag)
            .addField("**Модератор**", message.author.tag)
            .addField("**Причина**", `${reason || "**Нет причины**"}`)
            .setFooter("Дата")
            .setTimestamp()

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send(aaembed)
    } catch (e) {
      console.log(e);
    }
  }
}
