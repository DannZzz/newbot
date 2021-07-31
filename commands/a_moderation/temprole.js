const {MessageEmbed} = require('discord.js');
const ms = require('ms');
const embed = require('../../embedConstructor');
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");

module.exports = {
  config: {
    name: "темпроль",
    description: "Давать временную роль участнику.",
    usage: "[тег | никнейм | упоминание | ID] [название роли | упоминание | ID] [время: 1m, 1h, 1d]",
    category: "a_moderation",
    accessableby: "Нужна права: Управлять ролями.",
    aliases: ["temprole", "tr", "тр"]
  },
  run: async (bot, message, args) => {
    try {
    if (!message.member.hasPermission("MANAGE_ROLES")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});

    if (!args[0]) return embed(message).setError("Укажите участника, чтобы давать роль.").send().then(msg => {msg.delete({timeout: "10000"})});
    if (!args[1]) return embed(message).setError("Укажите роль, чтобы давать участнику.").send().then(msg => {msg.delete({timeout: "10000"})});
    if (!args[2]) return embed(message).setError("Укажите время, чтобы давать роль.").send().then(msg => {msg.delete({timeout: "10000"})});

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    if (!member) return embed(message).setError(`Укажите участника.`).send().then(msg => {msg.delete({timeout: "10000"})});
    let role = message.mentions.roles.first() || bot.guilds.cache.get(message.guild.id).roles.cache.get(args[1]) || message.guild.roles.cache.find(c => c.name.toLowerCase() === args[1].toLocaleLowerCase());
    if (!role) return embed(message).setError(`Укажите роль.`).send().then(msg => {msg.delete({timeout: "10000"})});
    let sd = await serverModel.findOne({ serverID: message.guild.id });

    if (member.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return embed(message).setError("Невозможно давать роль этому участнику.").send().then(msg => {msg.delete({timeout: "10000"})});

    let authorHighestRole = message.member.roles.highest.position;
    let mentionHighestRole = member.roles.highest.position;
    if(mentionHighestRole >= authorHighestRole) {
      embed(message).setError('Вы не сможете давать роль, с ролью выше вас, либо себя.').send().then(msg => {msg.delete({timeout: "10000"})});
      return;}

    // const userRoles = mutee.roles.cache
    //       .filter(r => r.id !== message.guild.id)
    //       .map(r => r.id)

    let aLerole = message.guild.roles.cache.find(r => r.name === role.name)

    if (member.roles.cache.has(aLerole.id)) return embed(message).setError(`Этот участник уже имеет роль: **${role.name}**.`).send().then(msg => {msg.delete({timeout: "10000"})})
      // РОль мута конец
      var muteTime = args[2];
      if(muteTime){
        if(!isNaN(muteTime)) {return embed(message).setError(`Укажите доступный формат времени: \`\`20s, 1m, 1h, 1d\`\``).send().then(msg => {msg.delete({timeout: "5000"})})}
        if (member.roles.cache.find(r => r.name === role.name)) {
           return embed(message).setError(`<@${member.id}> этот участник уже имеет роль: **${role.name}**.`).send().then(msg => {msg.delete({timeout: "5000"})});
        } else if (!ms(muteTime)) {
          return embed(message).setError(`Укажите доступный формат времени: \`\`20s, 1m, 1h, 1d\`\``).send().then(msg => {msg.delete({timeout: "5000"})})
        } else if (ms(muteTime) < 60000) {
          return embed(message).setError(`Минимальное время 1 минута.`).send().then(msg => {msg.delete({timeout: "5000"})})
        } else {
          const sembed = new MessageEmbed()
              .setColor(greenlight)
              .setFooter(`Роль будет снята: `)
              .setTimestamp(Date.now() + ms(muteTime))
              .setAuthor(message.guild.name, message.guild.iconURL())
          member.roles.add(role).then(() => message.channel.send(sembed.setDescription(`${AGREE} <@${member.id}> получил(а) роль: **${role.name}**.`)));


          setTimeout(function(){
            if(member.roles.cache.find(r => r.name === role.name)){
              const sembed = new MessageEmbed()
                  .setColor(greenlight)
                  .setTimestamp()
                  .setAuthor(message.guild.name, message.guild.iconURL())
              member.roles.remove(role);
              message.channel.send(sembed.setDescription(`${AGREE} <@${member.id}> с вас снята роль: **${role.name}** 😊`));
            }
          }, ms(muteTime));
        }
      }

      let channel = sd.modLog;
      if (!channel) return;

      let aaembed = new MessageEmbed()
            .setColor(redlight)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
            .addField("**Модерация**", "Временная роль")
            .addField("**Участник**", member.user.username)
            .addField("**Модератор**", message.author.username)
            .addField("**Роль**", `**${role.name}**`)
            .addField("**Время**", `${muteTime}`)
            .addField("**Дата**", message.createdAt.toLocaleString())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send(aaembed)
      } catch (e){
        console.log(e);
      }
  }

}
