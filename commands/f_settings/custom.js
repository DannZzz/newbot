const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js")
const {PREFIX} = require("../../config");
const customModel = require("../../models/customSchema");

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

      if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});

      if (!args[0]) return embed(message)
                              .setError('Укажите название.')
                              .send()
      if (!args[1]) return embed(message)
                              .setError('Укажите сообщение.')
                              .send()
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
