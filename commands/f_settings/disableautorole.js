const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, DISAGREE, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");

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


      if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
      let sd = await serverModel.findOne({ serverID: message.guild.id });
        try {
          if(sd.autoRoleOn === false) {

            return embed(message).setError(`Авто-роль и так отключена.`).send();

          }  else {

            await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {autoRoleOn: false}})
            embed(message).setSuccess(`Отключена авто-роль сервера.`).send();
          }

        } catch {
            return embed(message).setError("Недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
        }
    }
};
