const {MessageEmbed} = require('discord.js');
const ms = require('ms');

const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const serverModel = require("../../models/serverSchema");

module.exports = {
  config: {
    name: "темпроль",
    description: "Давать участнику.",
    usage: "[тег | никнейм | упоминание | ID] [название роли | упоминание | ID] [время: 1m, 1h, 1d]",
    category: "a_moderation",
    accessableby: "Нужна права: Управлять ролями.",
    aliases: ["temprole", "tr", "тр"]
  },
  run: async (bot, message, args) => {
    try {
    let muteEmbed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
    .setColor(redlight)
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send(muteEmbed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(muteEmbed.setDescription("❌ У меня недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});

    if (!args[0]) return message.channel.send(muteEmbed.setDescription("❌ Укажите участника, чтобы давать роль.")).then(msg => {msg.delete({timeout: "10000"})});
    if (!args[1]) return message.channel.send(muteEmbed.setDescription("❌ Укажите роль, чтобы давать участнику.")).then(msg => {msg.delete({timeout: "10000"})});
    if (!args[2]) return message.channel.send(muteEmbed.setDescription("❌ Укажите время, чтобы давать роль.")).then(msg => {msg.delete({timeout: "10000"})});

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    if (!member) return message.channel.send(muteEmbed.setDescription(`❌ Укажите участника.`)).then(msg => {msg.delete({timeout: "10000"})});
    let role = message.mentions.roles.first() || bot.guilds.cache.get(message.guild.id).roles.cache.get(args[1]) || message.guild.roles.cache.find(c => c.name.toLowerCase() === args[1].toLocaleLowerCase());
    if (!role) return message.channel.send(muteEmbed.setDescription(`❌ Укажите роль.`)).then(msg => {msg.delete({timeout: "10000"})});
    let sd = await serverModel.findOne({ serverID: message.guild.id });

    if (member.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send(muteEmbed.setDescription("❌ Невозможно давать роль этому участнику.")).then(msg => {msg.delete({timeout: "10000"})});

    let authorHighestRole = message.member.roles.highest.position;
    let mentionHighestRole = member.roles.highest.position;
    if(mentionHighestRole >= authorHighestRole) {
      message.channel.send(muteEmbed.setDescription('❌ Вы не сможете давать роль, с ролью выше вас, либо себя.')).then(msg => {msg.delete({timeout: "10000"})});
      return;}

    // const userRoles = mutee.roles.cache
    //       .filter(r => r.id !== message.guild.id)
    //       .map(r => r.id)

    let aLerole = message.guild.roles.cache.find(r => r.name === role.name)

    if (member.roles.cache.has(aLerole.id)) return message.channel.send(muteEmbed.setDescription(`❌ Этот участник уже имеет роль: **${role.name}**.`)).then(msg => {msg.delete({timeout: "10000"})})
      // РОль мута конец
      var muteTime = args[2];
      if(muteTime){
        if(!isNaN(muteTime)) {return message.channel.send(muteEmbed.setDescription(`❌ Укажите доступный формат времени: \`\`20s, 1m, 1h, 1d\`\``)).then(msg => {msg.delete({timeout: "5000"})})}
        if (member.roles.cache.find(r => r.name === role.name)) {
           return message.channel.send(muteEmbed.setDescription(`❌ <@${member.id}> этот участник уже имеет роль: **${role.name}**.`)).then(msg => {msg.delete({timeout: "5000"})});
        } else if (!ms(muteTime)) {
          return message.channel.send(muteEmbed.setDescription(`❌ Укажите доступный формат времени: \`\`20s, 1m, 1h, 1d\`\``)).then(msg => {msg.delete({timeout: "5000"})})
        }
        else {
          const sembed = new MessageEmbed()
              .setColor(greenlight)
              .setFooter(`Роль будет снята: `)
              .setTimestamp(Date.now() + ms(muteTime))
              .setAuthor(message.guild.name, message.guild.iconURL())
          member.roles.add(role).then(() => message.channel.send(sembed.setDescription(`✅ <@${member.id}> получил роль: **${role.name}**.`)));


          setTimeout(function(){
            if(member.roles.cache.find(r => r.name === role.name)){
              const sembed = new MessageEmbed()
                  .setColor(greenlight)
                  .setTimestamp()
                  .setAuthor(message.guild.name, message.guild.iconURL())
              member.roles.remove(role);
              message.channel.send(sembed.setDescription(`✅ <@${member.id}> с вас снята роль: **${role.name}** 😊`));
            }
          }, ms(muteTime));
        }
      }

      let channel = sd.modLog;
      if (!channel) return;

      let embed = new MessageEmbed()
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
        sChannel.send(embed)
      } catch (e){
        console.log(e);
      }
  }

}
