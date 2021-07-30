const {MessageEmbed} = require('discord.js');
const {cyan} = require("../../JSON/colours.json");
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');

module.exports = {
    config: {
        name: "префикс",
        description: "Поменять префикс сервера.",
        usage: "[новый префикс]",
        category: "f_settings",
        accessableby: "Нужна права: Управление сервером.",
        aliases: ["prefix", "pr"]
    },
    run: async (bot, message, args) => {

        if (!message.member.hasPermission('ADMINISTRATOR' || "MANAGE_SERVER")) return embed(message).setError(`<@${message.member.id}> у вас недостаточно прав.`).send().then(msg => {msg.delete({timeout: "10000"})})
        let sd = await serverModel.findOne({ serverID: message.guild.id });
        if (!args[0]) {

          let b = sd.prefix;
          if (b) {
        return embed(message).setPrimary(`👀 Префикс сервера: \`${b}\``).send().then(msg => {msg.delete({timeout: "10000"})});
      } else return embed(message).setError("Пожалуйста, укажите новый префикс.").send().then(msg => {msg.delete({timeout: "10000"})});
    }

        try {

            let a = args.join(' ');
            let b = sd.prefix;

            if (a === b) {
                return embed(message).setError("Этот префикс уже установлен.").send().then(msg => {msg.delete({timeout: "10000"})})
            } else {
                await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {prefix: a}});

                return embed(message).setSuccess(`Новый префикс сервера: ${a}`).send()
            }
        } catch (e) {
            console.log(e)
        }
    }
}
