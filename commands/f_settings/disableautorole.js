
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const serverModel = require("../../models/serverSchema");

module.exports = {
      config: {
        name: "откл-автороль",
        description: "Отключить автороль для сервера.",
        usage: "[Название роли | упоминание | ID]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["disa-autorole", "dar", "оар"]
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
          if(sd.autoRoleOn === false) {

            return message.channel.send(sembed.setDescription(`Авто-роль и так отключена.`))

          }  else {

            await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {autoRoleOn: false}})
            message.channel.send(sembed.setDescription(`Отключена авто-роль сервера.`))
          }

        } catch {
            return message.channel.send(logEmbed.setDescription("❌ Недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
        }
    }
};
