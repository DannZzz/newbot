const embed = require('../../embedConstructor');
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

      if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
      let sd = await serverModel.findOne({ serverID: message.guild.id });
        try {
          if(!args[0] && sd.autoRoleOn) {
            var role = member.guild.roles.cache.find(role => role.id == sd.autoRole);
            if (role) {
              return embed(message).setPrimary(`Авто-роль сервера: **${role.name}**\nУбедитесь что моя роль выше!`).send()
            }
          } else if (!args[0]) {
            return embed(message).setError(`Укажите роль!`).send()
          } else {
            let role = message.mentions.roles.first() || bot.guilds.cache.get(message.guild.id).roles.cache.get(args[0]) || message.guild.roles.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
            await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {autoRole: role.id, autoRoleOn: true}})
            embed(message).setSuccess(`Установлена авто-роль сервера: **${role.name}**\nУбедитесь что моя роль выше!`).send()
          }

        } catch {
            return embed(message).setError("Недостаточно прав, либо роль не существует.").send().then(msg => {msg.delete({timeout: "10000"})});
        }
    }
};
