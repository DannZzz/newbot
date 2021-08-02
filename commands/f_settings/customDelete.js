const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js")
const {PREFIX} = require("../../config");
const customModel = require("../../models/customSchema");

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

      if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});

      if (!args[0]) return embed(message)
                              .setError('Укажите название.')
                              .send()
      let cmd = args[0]

      let data = await customModel.findOne({ serverID: message.guild.id, command: cmd }, async(err, data) => {
        if(err) throw err;
        if(data) {
          data.delete()
          embed(message).setSuccess(`Успешно удалена команда **${cmd}**.`).send()
        } else if(!data) {
          embed(message).setError(`Команда **${cmd}** не найдена.`).send()
        }
      });


    }
};
