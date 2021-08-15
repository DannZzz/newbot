const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js")
const {PREFIX} = require("../../config");
const customModel = require("../../models/customSchema");
const {error} = require('../../functions');

module.exports = {
      config: {
        name: "удалить",
        description: "Удалить пользовательскую команду.",
        usage: "[название команды]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["delete"]
    },
    run: async (bot, message, args) => {

      if (!message.member.hasPermission("ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
      if (!args[0]) return error(message, 'Укажите название.')
      let cmd = args[0]

      let data = await customModel.findOne({ serverID: message.guild.id, command: cmd }, async(err, data) => {
        if(err) throw err;
        if(data) {
          data.delete()
          embed(message).setSuccess(`Успешно удалена команда **${cmd}**.`).send()
        } else if(!data) {
          error(message, `Команда **${cmd}** не найдена.`)
        }
      });


    }
};
