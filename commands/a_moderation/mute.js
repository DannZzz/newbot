const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');
module.exports = {
  config: {
    name: "мьют-навсегда",
    description: "Замьютить участника.",
    usage: "[тег | никнейм | упоминание | ID]",
    category: "a_moderation",
    accessableby: "Нужна права: Управлять сообщениями.",
    aliases: ["forever-mute", "fm", "фм"]
  },
  run: async (bot, message, args) => {
    try {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});

      if (!args[0]) return embed(message).setError("Укажите участника, чтобы замутить.").send().then(msg => {msg.delete({timeout: "10000"})});
      let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
      if (!mutee) return embed(message).setError(`Укажите участника.`).send().then(msg => {msg.delete({timeout: "10000"})});
      let sd = await serverModel.findOne({ serverID: message.guild.id });
      if (mutee === message.member) return embed(message).setError("Невозможно замьютить себя.").send().then(msg => {msg.delete({timeout: "10000"})});
      if (mutee.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return embed(message).setError("Невозможно замьютить этого участника.").send().then(msg => {msg.delete({timeout: "10000"})});

      let authorHighestRole = message.member.roles.highest.position;
      let mentionHighestRole = mutee.roles.highest.position;
      if(mentionHighestRole >= authorHighestRole || mentionHighestRole >= message.guild.me.roles.highest.position) {
        embed(message).setError('Вы не сможете замутить участника с ролью выше вас, либо себя.').send().then(msg => {msg.delete({timeout: "10000"})});
        return;}

      let reason = args.slice(1).join(" ");
      if (mutee.user.bot) return embed(message).setError("Невозможно замьютить ботов.").send().then(msg => {msg.delete({timeout: "10000"})});
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

      if (mutee.roles.cache.has(muterole.id)) return embed(message).setError("Этот участник уже замучен.").send().then(msg => {msg.delete({timeout: "10000"})})

      if (reason) {
                const sembed = new MessageEmbed()
                    .setColor(greenlight)
                    .setTimestamp()
                    .setAuthor(message.guild.name, message.guild.iconURL())
                    .setDescription(`${AGREE} <@${mutee.id}> успешно замучен по причине: \`\`${reason}\`\``)
                mutee.roles.add(muterole);
                message.channel.send(sembed);
                } else {
                    const sembed2 = new MessageEmbed()
                    .setColor(greenlight)
                    .setTimestamp()
                    .setAuthor(message.guild.name, message.guild.iconURL())
                    .setDescription(`${AGREE} <@${mutee.id}> успешно замучен.`)
                mutee.roles.add(muterole);
                message.channel.send(sembed2);
                }

      let channel = sd.modLog;
      if (!channel) return;

      let aembed = new MessageEmbed()
            .setColor(redlight)
            .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
            .addField("**Модерация**", "Мьют")
            .addField("**Участник**", mutee.user.tag)
            .addField("**Модератор**", message.author.tag)
            .addField("**Причина**", `${reason || "**Нет причины**"}`)
            .setFooter("Дата")
            .setTimestamp()

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send(aembed)
    } catch (e) {
      console.log(e);
    }
  }
}
