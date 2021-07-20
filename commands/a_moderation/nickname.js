const db = require('quick.db');
const { MessageEmbed } = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');

module.exports = {
  config: {
    name: "никнейм",
    description: "Изменить никнейм участника.",
    usage: "[тег | никнейм | упоминание | ID] (новый никнейм)",
    category: "a_moderation",
    accessableby: "Нужна права: Управлять никнеймами.",
    aliases: ["ник", "nick", "nickname"]
  },
  run: async (bot, message, args) => {
    let nickEmbed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
    .setColor(redlight)
    if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.channel.send(nickEmbed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});

    if (!message.guild.me.hasPermission("CHANGE_NICKNAME" && "MANAGE_NICKNAMES")) return message.channel.send(nickEmbed.setDescription("❌ У меня недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})})

    if (!args[0]) return message.channel.send(nickEmbed.setDescription("❌ Укажите участника.")).then(msg => {msg.delete({timeout: "10000"})})

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase()) || message.member;
    if (!member) return message.channel.send(nickEmbed.setDescription("❌ Укажите участника.")).then(msg => {msg.delete({timeout: "10000"})})
    let sd = await serverModel.findOne({ serverID: message.guild.id });
    let authorHighestRole = message.member.roles.highest.position;
    let mentionHighestRole = member.roles.highest.position;
    if(mentionHighestRole >= authorHighestRole) {
      message.channel.send(nickEmbed.setDescription('❌ Вы не сможете изменить никнейм участника с ролью выше вас, либо свой.')).then(msg => {msg.delete({timeout: "10000"})});
      return;}
    if (member.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send(nickEmbed.setDescription("❌ Я не могу изменить никнейм этого участника.")).then(msg => {msg.delete({timeout: "10000"})})

    if (!args[1]) return message.channel.send(nickEmbed.setDescription("❌ Укажите никнейм.")).then(msg => {msg.delete({timeout: "10000"})})

    let nick = args.slice(1).join(' ');

    try {
        member.setNickname(nick)
        const embed = new MessageEmbed()
            .setColor(greenlight)
            .setDescription(`Новый никнейм: ${nick} для участника: ${member.displayName}`)
            .setAuthor(message.guild.name, message.guild.iconURL())
        message.channel.send(embed)
        } catch {
            return message.channel.send(nickEmbed.setDescription("❌ У меня недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
        }

    let channel = sd.modLog;
        if (!channel) return;

        const sembed = new MessageEmbed()
            .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
            .setColor(greenlight)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter(message.guild.name, message.guild.iconURL())
            .addField("**Модерация**", "Изменение ника")
            .addField("**Участник**", member.user.username)
            .addField("**Модератор**", message.author.username)
            .addField("**Новый ник**", args[1])
            .addField("**Дата**", message.createdAt.toLocaleString())
            .setTimestamp();

            var sChannel = message.guild.channels.cache.get(channel)
            if (!sChannel) return;
            sChannel.send(sembed)
  }
}
