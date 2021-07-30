const {MessageEmbed} = require('discord.js');
const embed = require('../../embedConstructor');
const {AGREE} = require('../../config');
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

              if (!message.member.hasPermission("KICK_MEMBERS")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
              if (!message.guild.me.hasPermission("KICK_MEMBERS")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});

              if (!args[0]) return embed(message).setError("Укажите участника, чтобы выгнать.").send().then(msg => {msg.delete({timeout: "10000"})});

              var kickMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
              if (!kickMember) return embed(message).setError("Пользователь не в сервере.").send().then(msg => {msg.delete({timeout: "10000"})});
              let sd = await serverModel.findOne({ serverID: message.guild.id });
              if (kickMember.id === message.member.id) return embed(message).setError("Вы хотите выгнать себя? да ну, это не реально.").send();

              if (!kickMember.kickable) return embed(message).setError("Невозможно выгнать этого участника.").send().then(msg => {msg.delete({timeout: "10000"})})
              if (kickMember.user.bot) return embed(message).setError("Невозможно выгнать этого бота.").send().then(msg => {msg.delete({timeout: "10000"})})
              let authorHighestRole = message.member.roles.highest.position;
              let mentionHighestRole = kickMember.roles.highest.position;
              if(mentionHighestRole >= authorHighestRole) {
                embed(message).setError('Вы не сможете выгнать участника с ролью выше вас, либо себя.').send().then(msg => {msg.delete({timeout: "10000"})});
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
                  .setFooter(message.guild.name, message.guild.iconURL())
                  .addField("**Модерация**", "Кик участника")
                  .addField("**Участник**", kickMember.user.username)
                  .addField("**Модератор**", message.author.username)
                  .addField("**Причина**", `${reason || "**No Reason**"}`)
                  .addField("**Дата**", message.createdAt.toLocaleString())
                  .setTimestamp();

              var sChannel = message.guild.channels.cache.get(channel)
              if (!sChannel) return;
              sChannel.send(bembed)

            } catch (e) {
              console.log(e);
            }

   }
}
