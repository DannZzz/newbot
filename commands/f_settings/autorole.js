const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const serverModel = require("../../models/serverSchema");
const {error} = require('../../functions');

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

      if (!message.member.hasPermission("ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) return error(message, "У меня недостаточно прав.");
      let sd = await serverModel.findOne({ serverID: message.guild.id });
        try {
          if(!args[0] && sd.autoRoleOn) {
            var role = member.guild.roles.cache.find(role => role.id == sd.autoRole);
            if (role) {
              return embed(message).setPrimary(`Авто-роль сервера: **${role.name}**\nУбедитесь что моя роль выше!`).send()
            }
          } else if (!args[0]) {
            return error(message, `Укажите роль!`)
          } else {
            let role = message.mentions.roles.first() || bot.guilds.cache.get(message.guild.id).roles.cache.get(args[0]) || message.guild.roles.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
            await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {autoRole: role.id, autoRoleOn: true}})
            embed(message).setSuccess(`Установлена авто-роль сервера: **${role.name}**\nУбедитесь что моя роль выше!`).send()
          }

        } catch {
            return error(message, "Недостаточно прав, либо роль не существует.");
        }
    }
};
