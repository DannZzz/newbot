const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");

module.exports = {
    config: {
      name: "очистить",
      description: "Удалить кол-во сообщений.",
      usage: "[число]",
      category: "moderation",
      accessableby: "Нужна права: Управлять сообщениями.",
      aliases: ["clear", "purge", "cl", "оч"]
    },
    run: async (bot, message, args) => {
      let clearEmbed = new MessageEmbed()
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
      .setColor(redlight)
      let sembed = new MessageEmbed()
      .setTimestamp()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setColor(greenlight)
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(clearEmbed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send(clearEmbed.setDescription("❌ У меня недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
        if (isNaN(args[0]))
            return message.channel.send(clearEmbed.setDescription("❌ Укажите допустимый формат числ.")).then(msg => {msg.delete({timeout: "10000"})});

        if (args[0] >= 100)
            return message.channel.send(clearEmbed.setDescription("❌ Укажите число меньше 100.")).then(msg => {msg.delete({timeout: "10000"})});

        if (args[0] < 1)
            return message.channel.send(clearEmbed.setDescription("❌ Укажите число больше 1.")).then(msg => {msg.delete({timeout: "10000"})});

        message.channel.bulkDelete(+args[0]+1)
            .then(messages => message.channel.send(sembed.setDescription(`**Успешно удалено \`${messages.size-1}/${args[0]}\` сообщений**`)).then(msg => msg.delete({ timeout: "10000" }))).catch(() => null)
    }
}
