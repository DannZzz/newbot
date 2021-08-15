const {MessageEmbed} = require('discord.js');
const embed = require('../../embedConstructor');
const {AGREE} = require('../../config');
const {greenlight, redlight} = require('../../JSON/colours.json');
const serverModel = require("../../models/serverSchema");
const {error} = require('../../functions');

module.exports = {
  config: {
      name: "кик",
      description: "Кикнуть участника из сервера.",
      usage: "[тег | никнейм | упоминание | ID] (причина)",
      category: "a_moderation",
      accessableby: "Нужна права: Выгонять участников.",
      aliases: ["kick", "k", "к"]
    },
    run: async (bot, message, args) => {
          try {

              if (!message.member.hasPermission("KICK_MEMBERS")) return error(message, "У вас недостаточно прав.");
              if (!message.guild.me.hasPermission("KICK_MEMBERS")) return error(message, "У меня недостаточно прав.");

              if (!args[0]) return error(message, "Укажите участника, чтобы выгнать.");

              var kickMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
              if (!kickMember) return error(message, "Пользователь не в сервере.");
              let sd = await serverModel.findOne({ serverID: message.guild.id });
              if (kickMember.id === message.member.id) return error(message, "Вы хотите выгнать себя? да ну, это не реально.").send();

              if (!kickMember.kickable) return error(message, "Невозможно выгнать этого участника.").send().then(msg => {msg.delete({timeout: "10000"})})
              if (kickMember.user.bot) return error(message, "Невозможно выгнать этого бота.").send().then(msg => {msg.delete({timeout: "10000"})})
              let authorHighestRole = message.member.roles.highest.position;
              let mentionHighestRole = kickMember.roles.highest.position;
              if(mentionHighestRole >= authorHighestRole) {
                error(message, 'Вы не сможете выгнать участника с ролью выше вас, либо себя.');
                return;}

              var reason = args.slice(1).join(" ");
              if (reason) {
              kickMember.kick()
              var sembed = new MessageEmbed()
                  .setColor(greenlight)
                  .setTimestamp()
                  .setAuthor(message.guild.name, message.guild.iconURL())
                  .setDescription(`${AGREE} **${kickMember.user.username}** был выгнан по причине: \`\`${reason}\`\``)
              message.channel.send(sembed);
              } else {
                  kickMember.kick()
                  var sembed2 = new MessageEmbed()
                  .setColor(greenlight)
                  .setTimestamp()
                  .setAuthor(message.guild.name, message.guild.iconURL())
                  .setDescription(`${AGREE} **${kickMember.user.username}** был выгнан.`)
              message.channel.send(sembed2);
              }
              let channel = sd.modLog;
              if (!channel) return;

              const bembed = new MessageEmbed()
                  .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
                  .setColor(redlight)
                  .setThumbnail(kickMember.user.displayAvatarURL({ dynamic: true }))
                  .setFooter("Дата")
                  .addField("**Модерация**", "Кик участника")
                  .addField("**Участник**", kickMember.user.tag)
                  .addField("**Модератор**", message.author.tag)
                  .addField("**Причина**", `${reason || "**Нет причины**"}`)
                  .setTimestamp();

              var sChannel = message.guild.channels.cache.get(channel)
              if (!sChannel) return;
              sChannel.send(bembed)

            } catch (e) {
              console.log(e);
            }

   }
}
