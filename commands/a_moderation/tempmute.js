const {MessageEmbed} = require('discord.js');
const ms = require('ms');
const embed = require('../../embedConstructor');
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");
const memberModel = require("../../models/memberSchema");
const {error} = require('../../functions');

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
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return error(message, "У вас недостаточно прав.");
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return error(message, "У меня недостаточно прав.");

    if (!args[0]) return error(message, "Укажите участника, чтобы замутить.");
    if (!args[1]) return error(message, "Укажите время \`\`1m, 1h\`\`, чтобы замутить.");

    let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    if (!mutee) return error(message, `Укажите участника.`);
    let sd = await serverModel.findOne({ serverID: message.guild.id });
    if (mutee === message.member) return error(message, "Невозможно замьютить себя.");
    if (mutee.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return error(message, "Невозможно замьютить этого участника.");

    let authorHighestRole = message.member.roles.highest.position;
    let mentionHighestRole = mutee.roles.highest.position;
    if(mentionHighestRole >= authorHighestRole) {
      error(message, 'Вы не сможете замутить участника с ролью выше вас, либо себя.');
      return;}

    let reason = args.slice(2).join(" ");
    if (mutee.user.bot) return error(message, "Невозможно замьютить ботов.");
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

    if (mutee.roles.cache.has(muterole.id)) return error(message, "Этот участник уже замучен.").send().then(msg => {msg.delete({timeout: "10000"})})
      // РОль мута конец
      var muteTime = args[1];
      if(!isNaN(muteTime)) {return}
      if(muteTime){
        if(!isNaN(muteTime)) {return error(message, `Укажите доступный формат времени: \`\`20s, 1m, 1h, 1d\`\``);}
        if (mutee.roles.cache.find(r => r.name === muterole.name)) {
           return error(message, `<@${mutee.id}> этот учатник уже замучен!`);;
        } else if (!ms(muteTime)) {
          return error(message, `Укажите доступный формат времени: \`\`20s, 1m, 1h, 1d\`\``);
        } else if (ms(muteTime) < 60000) {
          return error(message, `Минимальное время 1 минута.`);
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

            mutee.roles.add(muterole).then(() => message.channel.send(sembed.setDescription(`${AGREE} <@${mutee.id}> получил(а) мьют.`)));

          } catch (e) {
            console.log(e);
          }

        }
      }

      let channel = sd.modLog;
      if (!channel) return;

      let aaembed = new MessageEmbed()
            .setColor(redlight)
            .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
            .addField("**Модерация**", "Временный мьют")
            .addField("**Участник**", mutee.user.tag)
            .addField("**Модератор**", message.author.tag)
            .addField("**Время**", `${muteTime}`)
            .addField("**Причина**", `${reason || 'Нет причины'}`)
            .setFooter('Дата')
            .setTimestamp()

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send(aaembed)
      } catch (e){
        console.log(e);
      }
  }

}
