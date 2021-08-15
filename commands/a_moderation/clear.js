const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const embed = require('../../embedConstructor');
const {error} = require('../../functions');

module.exports = {
    config: {
      name: "очистить",
      description: "Удалить кол-во сообщений.",
      usage: "[число]",
      category: "a_moderation",
      accessableby: "Нужна права: Управлять сообщениями.",
      aliases: ["clear", "purge", "cl", "оч"]
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return error(message, "У вас недостаточно прав.");
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return error(message, "У меня недостаточно прав.");
        if (isNaN(args[0]))
            return error(message, "Укажите допустимый формат числ.");

        if (args[0] >= 100)
            return error(message, "Укажите число меньше 100.");

        if (args[0] < 1)
            return error(message, "Укажите число больше 1.");

        message.channel.bulkDelete(+args[0]+1)
            .then(messages => embed(message).setSuccess(`**Успешно удалено \`${messages.size-1}/${args[0]}\` сообщений**`).send().then(msg => msg.delete({ timeout: "10000" }))).catch(() => null)
    }
}
