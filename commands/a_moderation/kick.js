const {MessageEmbed} = require('discord.js');

const {greenlight, redlight} = require('../../JSON/colours.json');
const serverModel = require("../../models/serverSchema");


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
              let kickEmbed = new MessageEmbed()
              .setTimestamp()
              .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
              .setColor(redlight)
              if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(kickEmbed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
              if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.channel.send(kickEmbed.setDescription("❌ У меня недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});

              if (!args[0]) return message.channel.send(kickEmbed.setDescription("❌ Укажите участника, чтобы выгнать.")).then(msg => {msg.delete({timeout: "10000"})});

              var kickMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
              if (!kickMember) return message.channel.send(kickEmbed.setDescription("❌ Пользователь не в сервере.")).then(msg => {msg.delete({timeout: "10000"})});
              let sd = await serverModel.findOne({ serverID: message.guild.id });
              if (kickMember.id === message.member.id) return message.channel.send("❌ Вы хотите выгнать себя? да ну, это не реально.")

              if (!kickMember.kickable) return message.channel.send(kickEmbed.setDescription("❌ Невозможно выгнать этого участника.")).then(msg => {msg.delete({timeout: "10000"})})
              if (kickMember.user.bot) return message.channel.send(kickEmbed.setDescription("❌ Невозможно выгнать этого бота.")).then(msg => {msg.delete({timeout: "10000"})})
              let authorHighestRole = message.member.roles.highest.position;
              let mentionHighestRole = kickMember.roles.highest.position;
              if(mentionHighestRole >= authorHighestRole) {
                message.channel.send(kickEmbed.setDescription('❌ Вы не сможете выгнать участника с ролью выше вас, либо себя.')).then(msg => {msg.delete({timeout: "10000"})});
                return;}

              var reason = args.slice(1).join(" ");
              if (reason) {
              kickMember.kick()
              var sembed = new MessageEmbed()
                  .setColor(greenlight)
                  .setTimestamp()
                  .setAuthor(message.guild.name, message.guild.iconURL())
                  .setDescription(`✅ **${kickMember.user.username}** был выгнан по причине: \`\`${reason}\`\``)
              message.channel.send(sembed);
              } else {
                  kickMember.kick()
                  var sembed2 = new MessageEmbed()
                  .setColor(greenlight)
                  .setTimestamp()
                  .setAuthor(message.guild.name, message.guild.iconURL())
                  .setDescription(`✅ **${kickMember.user.username}** был выгнан.`)
              message.channel.send(sembed2);
              }
              let channel = sd.modLog;
              if (!channel) return;

              const embed = new MessageEmbed()
                  .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
                  .setColor(redlight)
                  .setThumbnail(kickMember.user.displayAvatarURL({ dynamic: true }))
                  .setFooter(message.guild.name, message.guild.iconURL())
                  .addField("**Модерация**", "Кик участника")
                  .addField("**Участник**", kickMember.user.username)
                  .addField("**Модератор**", message.author.username)
                  .addField("**Причина**", `${reason || "**No Reason**"}`)
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
