const {MessageEmbed} = require('discord.js');
const {cyan} = require("../../JSON/colours.json");
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');
const {error} = require('../../functions');

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

        if (!message.member.hasPermission('ADMINISTRATOR' || "MANAGE_SERVER")) return error(`<@${message.member.id}> у вас недостаточно прав.`)
        let sd = await serverModel.findOne({ serverID: message.guild.id });
        if (!args[0]) {

          let b = sd.prefix;
          if (b) {
        return embed(message).setPrimary(`👀 Префикс сервера: \`${b}\``);
      } else return error("Пожалуйста, укажите новый префикс.");
    }

        try {

            let a = args.join(' ');
            let b = sd.prefix;

            if (a === b) {
                return error("Этот префикс уже установлен.")
            } else {
                await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {prefix: a}});

                return embed(message).setSuccess(`Новый префикс сервера: ${a}`).send()
            }
        } catch (e) {
            console.log(e)
        }
    }
}
