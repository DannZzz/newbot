const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, DISAGREE, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");
const {error} = require('../../functions');

module.exports = {
      config: {
        name: "откл-автороль",
        description: "Отключить автороль для сервера.",
        usage: "[Название роли | упоминание | ID]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["dis-autorole", "dar", "оар"]
    },
    run: async (bot, message, args) => {


      if (!message.member.hasPermission("ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) return error(message, "У меня недостаточно прав.");
      let sd = await serverModel.findOne({ serverID: message.guild.id });
        try {
          if(sd.autoRoleOn === false) {

            return error(message, `Авто-роль и так отключена.`)

          }  else {

            await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {autoRoleOn: false}})
            embed(message).setSuccess(`Отключена авто-роль сервера.`).send();
          }

        } catch {
            return error(message, "Недостаточно прав.");
        }
    }
};
