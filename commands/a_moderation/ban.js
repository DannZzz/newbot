const {MessageEmbed} = require('discord.js');
let db = require('quick.db');
const {greenlight, redlight} = require('../../JSON/colours.json');
const serverModel = require("../../models/serverSchema");


module.exports = {
  config: {
      name: "бан",
      description: "Забанить участника из сервера.",
      usage: "[тег | никнейм | упоминание | ID] (причина)",
      category: "a_moderation",
      accessableby: "Нужна права: Банить участников.",
      aliases: ["ban", "б", "b"]
    },
    run: async (bot, message, args) => {
          try {
              let banEmbed = new MessageEmbed()
              .setTimestamp()
              .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
              .setColor(redlight)
              if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(banEmbed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
              if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send(banEmbed.setDescription("❌ У меня недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});

              if (!args[0]) return message.channel.send(banEmbed.setDescription("❌ Укажите участника, чтобы забанить.")).then(msg => {msg.delete({timeout: "10000"})});

              var banMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
              if (!banMember) return message.channel.send(banEmbed.setDescription("❌ Пользователь не в сервере.")).then(msg => {msg.delete({timeout: "10000"})});
              let sd = await serverModel.findOne({ serverID: message.guild.id });
              if (banMember.id === message.member.id) return message.channel.send(banEmbed.setDescription("❌ Вы хотите забанить себя? да ну, это не реально."));

              if (!banMember.bannable) return message.channel.send(banEmbed.setDescription("❌ Невозможно забанить этого участника.")).then(msg => {msg.delete({timeout: "10000"})})
              if (banMember.user.bot) return message.channel.send(banEmbed.setDescription("❌ Невозможно забанить этого бота.")).then(msg => {msg.delete({timeout: "10000"})})
              let authorHighestRole = message.member.roles.highest.position;
              let mentionHighestRole = banMember.roles.highest.position;
              if(mentionHighestRole >= authorHighestRole) {
                message.channel.send(banEmbed.setDescription('❌ Вы не сможете кикнуть участника с ролью выше вас, либо себя.')).then(msg => {msg.delete({timeout: "10000"})});
                return;}

              var reason = args.slice(1).join(" ");
              if (reason) {
              banMember.ban()
              var sembed = new MessageEmbed()
                  .setColor(greenlight)
                  .setTimestamp()
                  .setAuthor(message.guild.name, message.guild.iconURL())
                  .setDescription(`✅ **${banMember.user.username}** был забанен по причине: \`\`${reason}\`\``)
              message.channel.send(sembed);
              } else {
                  banMember.ban()
                  var sembed2 = new MessageEmbed()
                  .setColor(greenlight)
                  .setTimestamp()
                  .setAuthor(message.guild.name, message.guild.iconURL())
                  .setDescription(`✅ **${banMember.user.username}** был забанен.`)
              message.channel.send(sembed2);
              }
              let channel = sd.modLog;
              if (!channel) return;

              const embed = new MessageEmbed()
                  .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
                  .setColor(redlight)
                  .setThumbnail(banMember.user.displayAvatarURL({ dynamic: true }))
                  .setFooter(message.guild.name, message.guild.iconURL())
                  .addField("**Модерация**", "Бан учатника")
                  .addField("**Участник**", banMember.user.username)
                  .addField("**Модератор**", message.author.username)
                  .addField("**Причина**", `${reason || "**Нет причины**"}`)
                  .addField("**Дата**", message.createdAt.toLocaleString())
                  .setTimestamp();

              var sChannel = message.guild.channels.cache.get(channel)
              if (!sChannel) return;
              sChannel.send(embed)

            } catch (e) {
              console.log(e);
            }

   }
}
