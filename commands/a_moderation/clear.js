const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const embed = require('../../embedConstructor');

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
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
        if (isNaN(args[0]))
            return embed(message).setError("Укажите допустимый формат числ.").send().then(msg => {msg.delete({timeout: "10000"})});

        if (args[0] >= 100)
            return embed(message).setError("Укажите число меньше 100.").send().then(msg => {msg.delete({timeout: "10000"})});

        if (args[0] < 1)
            return embed(message).setError("Укажите число больше 1.").send().then(msg => {msg.delete({timeout: "10000"})});

        message.channel.bulkDelete(+args[0]+1)
            .then(messages => embed(message).setSuccess(`**Успешно удалено \`${messages.size-1}/${args[0]}\` сообщений**`).send().then(msg => msg.delete({ timeout: "10000" }))).catch(() => null)
    }
}
