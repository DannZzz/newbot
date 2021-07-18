
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const serverModel = require("../../serverSchema");


module.exports = {
  config: {
    name: "размьют",
    description: "Размьютить участника.",
    usage: "[тег | никнейм | упоминание | ID]",
    category: "moderation",
    accessableby: "Нужна права: Управлять сообщениями.",
    aliases: ["unmute", "um", "рм"]
  },
  run: async (bot, message, args) => {
    try {
      let muteEmbed = new MessageEmbed()
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
      .setColor(redlight)
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(muteEmbed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(muteEmbed.setDescription("❌ У меня недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});

      if (!args[0]) return message.channel.send(muteEmbed.setDescription("❌ Укажите участника, чтобы размьютить."))
      var mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
      let sd = await serverModel.findOne({ serverID: message.guild.id });
      if (!mutee) return message.channel.send(muteEmbed.setDescription("❌ Укажите участника.")).then(msg => {msg.delete({timeout: "10000"})});

      if (mutee === message.member) return message.channel.send(muteEmbed.setDescription("❌ Невозможно размьютить себя.")).then(msg => {msg.delete({timeout: "10000"})})
      if (mutee.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send(muteEmbed.setDescription("❌ Невозможно размьютить этого участника.")).then(msg => {msg.delete({timeout: "10000"})});
      let authorHighestRole = message.member.roles.highest.position;
      let mentionHighestRole = mutee.roles.highest.position;
      if(mentionHighestRole >= authorHighestRole) {
        message.channel.send(muteEmbed.setDescription('❌ Вы не сможете размутить участника с ролью выше вас, либо себя.')).then(msg => {msg.delete({timeout: "10000"})});
        return;}
      let reason = args.slice(1).join(" ");
      if (mutee.user.bot) return message.channel.send(muteEmbed.setDescription("❌ Невозможно размьютить ботов.")).then(msg => {msg.delete({timeout: "10000"})});
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

      if (!mutee.roles.cache.has(muterole.id))  return message.channel.send(muteEmbed.setDescription("❌ Этот участник уже размучен.")).then(msg => {msg.delete({timeout: "10000"})})

      if (reason) {
                const sembed = new MessageEmbed()
                    .setColor(greenlight)
                    .setTimestamp()
                    .setAuthor(message.guild.name, message.guild.iconURL())
                    .setDescription(`❌ Укажите участника.`)
                message.channel.send(sembed);
                } else {
                    const sembed2 = new MessageEmbed()
                    .setColor(greenlight)
                    .setTimestamp()
                    .setAuthor(message.guild.name, message.guild.iconURL())
                    .setDescription(`✅ <@${mutee.id}> успешно размучен.`)
                mutee.roles.remove(muterole);
                message.channel.send(sembed2);
                }

      let channel = sd.modLog;
      if (!channel) return;

      let embed = new MessageEmbed()
            .setColor(redlight)
            .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
            .addField("**Модерация**", "Размьют")
            .addField("**Участник**", mutee.user.username)
            .addField("**Модератор**", message.author.username)
            .addField("**Причина**", `${reason || "**Нет причины**"}`)
            .addField("**Дата**", message.createdAt.toLocaleString())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send(embed)
    } catch (e) {
      console.log(e);
    }
  }
}
