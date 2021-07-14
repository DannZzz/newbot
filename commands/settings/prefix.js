const {MessageEmbed} = require('discord.js');
let db = require('quick.db');
const {cyan} = require("../../JSON/colours.json");

module.exports = {
    config: {
        name: "префикс",
        description: "Поменять префикс сервера.",
        usage: "[новый префикс]",
        category: "settings",
        accessableby: "Нужна права: Управление сервером.",
        aliases: ["prefix", "pr"]
    },
    run: async (bot, message, args) => {
        let prefixEmbed = new MessageEmbed()
        .setTimestamp()
        .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
        .setColor(cyan)
        if (!message.member.hasPermission('ADMINISTRATOR' || "MANAGE_SERVER")) return message.channel.send(prefixEmbed.setDescription(`❌ <@${message.member.id}> у вас недостаточно прав.`)).then(msg => {msg.delete({timeout: "10000"})})

        if (!args[0]) {
          let b = await db.fetch(`prefix_${message.guild.id}`);
          if (b) {
        return message.channel.send(prefixEmbed.setDescription(`✅ Префикс сервера: ${b}`)).then(msg => {msg.delete({timeout: "10000"})});
      } else return message.channel.send(prefixEmbed.setDescription("❌ Пожалуйста, укажите новый префикс.")).then(msg => {msg.delete({timeout: "10000"})});
    }

        try {

            let a = args.join(' ');
            let b = await db.fetch(`prefix_${message.guild.id}`)

            if (a === b) {
                return message.channel.send(prefixEmbed.setDescription("❌ Этот префикс уже установлен.")).then(msg => {msg.delete({timeout: "10000"})})
            } else {
                db.set(`prefix_${message.guild.id}`, a)

                return message.channel.send(prefixEmbed.setDescription(`✅ Новый префикс сервера: ${a}`))
            }
        } catch (e) {
            console.log(e)
        }
    }
}
