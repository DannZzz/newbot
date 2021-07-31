const {MessageEmbed} = require('discord.js');
const {greenlight, redlight} = require('../../JSON/colours.json');
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');
const {AGREE} = require('../../config');

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

              if (!message.member.hasPermission("BAN_MEMBERS")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
              if (!message.guild.me.hasPermission("BAN_MEMBERS")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});

              if (!args[0]) return embed(message).setError("Укажите участника, чтобы забанить.").send().then(msg => {msg.delete({timeout: "10000"})});

              var banMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
              if (!banMember) return embed(message).setError("Пользователь не в сервере.").send().then(msg => {msg.delete({timeout: "10000"})});
              let sd = await serverModel.findOne({ serverID: message.guild.id });
              if (banMember.id === message.member.id) return embed(message).setError("Вы хотите забанить себя? да ну, это не реально.").send();

              if (!banMember.bannable) return embed(message).setError("Невозможно забанить этого участника.").send().then(msg => {msg.delete({timeout: "10000"})})
              if (banMember.user.bot) return embed(message).setError("Невозможно забанить этого бота.").send().then(msg => {msg.delete({timeout: "10000"})})
              let authorHighestRole = message.member.roles.highest.position;
              let mentionHighestRole = banMember.roles.highest.position;
              if(mentionHighestRole >= authorHighestRole) {
                embed(message).setError('Вы не сможете кикнуть участника с ролью выше вас, либо себя.').send().then(msg => {msg.delete({timeout: "10000"})});
                return;}

              var reason = args.slice(1).join(" ");
              if (reason) {
              banMember.ban()
              var sembed = new MessageEmbed()
                  .setColor(greenlight)
                  .setTimestamp()
                  .setAuthor(message.guild.name, message.guild.iconURL())
                  .setDescription(`${AGREE} **${banMember.user.username}** был забанен по причине: \`\`${reason}\`\``)
              message.channel.send(sembed);
              } else {
                  banMember.ban()
                  var sembed2 = new MessageEmbed()
                  .setColor(greenlight)
                  .setTimestamp()
                  .setAuthor(message.guild.name, message.guild.iconURL())
                  .setDescription(`${AGREE} **${banMember.user.username}** был забанен.`)
              message.channel.send(sembed2);
              }
              let channel = sd.modLog;
              if (!channel) return;

              const ssembed = new MessageEmbed()
                  .setAuthor(`${message.guild.name} Изменение`, message.guild.iconURL())
                  .setColor(redlight)
                  .setThumbnail(banMember.user.displayAvatarURL({ dynamic: true }))
                  .setFooter("Дата")
                  .addField("**Модерация**", "Бан учатника")
                  .addField("**Участник**", banMember.user.tag)
                  .addField("**Модератор**", message.author.tag)
                  .addField("**Причина**", `${reason || "**Нет причины**"}`)
                  .setTimestamp();

              var sChannel = message.guild.channels.cache.get(channel)
              if (!sChannel) return;
              sChannel.send(ssembed)

            } catch (e) {
              console.log(e);
            }

   }
}
