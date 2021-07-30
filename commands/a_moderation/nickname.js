const {AGREE} = require('../../config');
const { MessageEmbed } = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');
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

    if (!message.member.hasPermission("MANAGE_NICKNAMES")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});

    if (!message.guild.me.hasPermission("CHANGE_NICKNAME" && "MANAGE_NICKNAMES")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})})

    if (!args[0]) return embed(message).setError("Укажите участника.").send().then(msg => {msg.delete({timeout: "10000"})})

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase()) || message.member;
    if (!member) return embed(message).setError("Укажите участника.").send().then(msg => {msg.delete({timeout: "10000"})})
    let sd = await serverModel.findOne({ serverID: message.guild.id });
    let authorHighestRole = message.member.roles.highest.position;
    let mentionHighestRole = member.roles.highest.position;
    if(mentionHighestRole >= authorHighestRole) {
      embed(message).setError('Вы не сможете изменить никнейм участника с ролью выше вас, либо свой.').send().then(msg => {msg.delete({timeout: "10000"})});
      return;}
    if (member.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return embed(message).setError("Я не могу изменить никнейм этого участника.").send().then(msg => {msg.delete({timeout: "10000"})})

    if (!args[1]) return embed(message).setError("Укажите никнейм.").send().then(msg => {msg.delete({timeout: "10000"})})

    let nick = args.slice(1).join(' ');

    try {
        member.setNickname(nick)
        const aembed = new MessageEmbed()
            .setColor(greenlight)
            .setDescription(`${AGREE} Новый никнейм: \`\`${nick}\`\` для участника: ${member}`)
            .setAuthor(message.guild.name, message.guild.iconURL())
        message.channel.send(aembed)
        } catch {
            return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
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
