const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js")
const {PREFIX} = require("../../config");
const customModel = require("../../models/customSchema");
const {error} = require('../../functions');

module.exports = {
      config: {
        name: "команда",
        description: "Создать пользовательскую команду.",
        usage: "[название команды] [сообщение ответа]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["custom", "command"]
    },
    run: async (bot, message, args) => {

      if (!message.member.hasPermission("ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");

      if (!args[0]) return error(message, 'Укажите название.');
      if (!args[1]) return error(message, 'Укажите сообщение.');
      let cmd = args[0]
      let cnt = args.splice(1).join(" ")

      let data = await customModel.findOne({ serverID: message.guild.id, command: cmd }, async(err, data) => {
        if(err) throw err;
        if(data) {
          data.content = cnt;
          data.save();
          embed(message).setSuccess(`Успешно обновлена команда **${cmd}**.`).send()
        } else if(!data) {
          let newdata = await customModel.create({
            serverID: message.guild.id,
            command: cmd,
            content: cnt
          })
          newdata.save();
          embed(message).setSuccess(`Успешно создана новая команда **${cmd}**.`).send()
        }
      });


    }
};
