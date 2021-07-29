const {MessageEmbed} = require('discord.js');
const ms = require('ms');

const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const serverModel = require("../../models/serverSchema");
const memberModel = require("../../models/memberSchema");

module.exports = {
  config: {
    name: "мьют",
    description: "Замьютить участника на указанное время.",
    usage: "[тег | никнейм | упоминание | ID] [время: 1m, 1h, 1d]",
    category: "a_moderation",
    accessableby: "Нужна права: Управлять сообщениями.",
    aliases: ["mute", "m", "м"]
  },
  run: async (bot, message, args) => {
    try {
    let muteEmbed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
    .setColor(redlight)
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(muteEmbed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(muteEmbed.setDescription("❌ У меня недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});

    if (!args[0]) return message.channel.send(muteEmbed.setDescription("❌ Укажите участника, чтобы замутить.")).then(msg => {msg.delete({timeout: "10000"})});
    if (!args[1]) return message.channel.send(muteEmbed.setDescription("❌ Укажите время \`\`1m, 1h\`\`, чтобы замутить.")).then(msg => {msg.delete({timeout: "10000"})});

    let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    if (!mutee) return message.channel.send(muteEmbed.setDescription(`❌ Укажите участника.`)).then(msg => {msg.delete({timeout: "10000"})});
    let sd = await serverModel.findOne({ serverID: message.guild.id });
    if (mutee === message.member) return message.channel.send(muteEmbed.setDescription("❌ Невозможно замьютить себя.")).then(msg => {msg.delete({timeout: "10000"})});
    if (mutee.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send(muteEmbed.setDescription("❌ Невозможно замьютить этого участника.")).then(msg => {msg.delete({timeout: "10000"})});

    let authorHighestRole = message.member.roles.highest.position;
    let mentionHighestRole = mutee.roles.highest.position;
    if(mentionHighestRole >= authorHighestRole) {
      message.channel.send(muteEmbed.setDescription('❌ Вы не сможете замутить участника с ролью выше вас, либо себя.')).then(msg => {msg.delete({timeout: "10000"})});
      return;}

    let reason = args.slice(1).join(" ");
    if (mutee.user.bot) return message.channel.send(muteEmbed.setDescription("❌ Невозможно замьютить ботов.")).then(msg => {msg.delete({timeout: "10000"})});
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

    if (!muterole) {
              try {
                  muterole = await message.guild.roles.create({
                      data: {
                          name: "Замучен",
                          color: "#514f48",
                          permissions: []
                      }
                  })
                  message.guild.channels.cache.forEach(async (channel) => {
                      await channel.createOverwrite(muterole, {
                          SEND_MESSAGES: false,
                          ADD_REACTIONS: false,
                          SPEAK: false
                      })
                  })
              } catch (e) {
                  console.log(e);
              }
    };

    if (mutee.roles.cache.has(muterole.id)) return message.channel.send(muteEmbed.setDescription("❌ Этот участник уже замучен.")).then(msg => {msg.delete({timeout: "10000"})})
      // РОль мута конец
      var muteTime = args[1];
      if(!isNaN(muteTime)) {return}
      if(muteTime){
        if(!isNaN(muteTime)) {return message.channel.send(muteEmbed.setDescription(`❌ Укажите доступный формат времени: \`\`20s, 1m, 1h, 1d\`\``)).then(msg => {msg.delete({timeout: "5000"})})}
        if (mutee.roles.cache.find(r => r.name === muterole.name)) {
           return message.channel.send(muteEmbed.setDescription(`❌ <@${mutee.id}> этот учатник уже замучен!`)).then(msg => {msg.delete({timeout: "5000"})});
        } else if (!ms(muteTime)) {
          return message.channel.send(muteEmbed.setDescription(`❌ Укажите доступный формат времени: \`\`20s, 1m, 1h, 1d\`\``)).then(msg => {msg.delete({timeout: "5000"})})
        } else if (ms(muteTime) < 60000) {
          return message.channel.send(muteEmbed.setDescription(`❌ Минимальное время 1 минута.`)).then(msg => {msg.delete({timeout: "5000"})})
        }
        else {
          try {
            let data = await memberModel.findOne({
              userID: mutee.id,
              serverID: message.guild.id
            })


            const muteDate = new Date()
            muteDate.setMilliseconds(muteDate.getMilliseconds() + ms(muteTime))

            if (data) {
              await memberModel.findOneAndUpdate({userID: mutee.id, serverID: message.guild.id}, {$set: {muteTime: muteDate}})
            }else if (!data) {
              let newData = await memberModel.create({
                userID: mutee.id,
                serverID: message.guild.id,
                muteTime: muteDate
              });
              newData.save()}

            const sembed = new MessageEmbed()
                .setColor(greenlight)
                .setFooter("Мьют будет снят: ")
                .setTimestamp(Date.now() + ms(muteTime))
                .setAuthor(message.guild.name, message.guild.iconURL())

            mutee.roles.add(muterole).then(() => message.channel.send(sembed.setDescription(`✅ <@${mutee.id}> получил(а) мьют.`)));

          } catch (e) {
            console.log(e);
          }

        }
      }

      let channel = sd.modLog;
      if (!channel) return;

      let embed = new MessageEmbed()
            .setColor(redlight)
            .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
            .addField("**Модерация**", "Временный мьют")
            .addField("**Участник**", mutee.user.username)
            .addField("**Модератор**", message.author.username)
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
