
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const serverModel = require("../../models/serverSchema");

module.exports = {
      config: {
        name: "автороль",
        description: "Установить автороль для сервера.",
        usage: "[Название роли | упоминание | ID]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["autorole", "ar", "ар"]
    },
    run: async (bot, message, args) => {
      let logEmbed = new MessageEmbed()
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
      .setColor(redlight)
      .setFooter("Убедитесь что моя роль выше!")
      let sembed = new MessageEmbed()
      .setTimestamp()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setColor(greenlight)
      .setFooter("Убедитесь что моя роль выше!")

      if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(logEmbed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(logEmbed.setDescription("❌ У меня недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
      let sd = await serverModel.findOne({ serverID: message.guild.id });
        try {
          if(!args[0] && sd.autoRoleOn) {
            var role = member.guild.roles.cache.find(role => role.id == sd.autoRole);
            if (role) {
              return message.channel.send(sembed.setDescription(`Авто-роль сервера: **${role.name}**`))
            }
          } else if (!args[0]) {
            return message.channel.send(logEmbed.setDescription(`Укажите роль!`))
          } else {
            let role = message.mentions.roles.first() || bot.guilds.cache.get(message.guild.id).roles.cache.get(args[0]) || message.guild.roles.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
            await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {autoRole: role.id, autoRoleOn: true}})
            message.channel.send(sembed.setDescription(`Установлена авто-роль сервера: **${role.name}**`))
          }

        } catch {
            return message.channel.send(logEmbed.setDescription("❌ Недостаточно прав, либо роль не существует.")).then(msg => {msg.delete({timeout: "10000"})});
        }
    }
};
