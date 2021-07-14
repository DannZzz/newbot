const db = require('quick.db');
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
module.exports = {
      config: {
        name: "мод-лог-канал",
        description: "Изменить никнейм участника.",
        usage: "[название текстового канала | упоминание | ID]",
        category: "settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["mod-log-channel", "млк", "mlc", "logc"]
    },
    run: async (bot, message, args) => {
      let logEmbed = new MessageEmbed()
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
      .setColor(redlight)
      let sembed = new MessageEmbed()
      .setTimestamp()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setColor(greenlight)

      if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(logEmbed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
      if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(logEmbed.setDescription("❌ У меня недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
    if (!args[0]) {
      let b = await db.fetch(`modlog_${message.guild.id}`);
      let channelName = message.guild.channels.cache.get(b);
      if (message.guild.channels.cache.has(b)) {
        return message.channel.send(sembed.setDescription(
          `✅ Журнал модерации установлен на: <#${channelName.id}>`
        ));
      } else
        return message.channel.send(logEmbed.setDescription(
          "❌ Укажите доступный тектовый канал."
        )).then(msg => {msg.delete({timeout: "10000"})});
    }
        let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

        if (!channel || channel.type !== 'text') return message.channel.send(logEmbed.setDescription("❌ Укажите доступный текстовый канал.")).then(msg => {msg.delete({timeout: "10000"})});

        try {
            let a = await db.fetch(`modlog_${message.guild.id}`)

            if (channel.id === a) {
                return message.channel.send(sembed.setDescription(`✅ <#${channel.id}> этот канал уже установлен для модерации.`));
            } else {
                bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send(sembed.setDescription(`✅ Журнал модерации установлен на этот канал.`));
                db.set(`modlog_${message.guild.id}`, channel.id)

                message.channel.send(sembed.setDescription(`✅ <#${channel.id}> установлен новый канал для модерации.`));
            }
        } catch {
            return message.channel.send(logEmbed.setDescription("❌ Недостаточно прав, либо канал не существует.")).then(msg => {msg.delete({timeout: "10000"})});
        }
    }
};
