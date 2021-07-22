
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const serverModel = require("../../models/serverSchema");

module.exports = {
      config: {
        name: "откл-мод-лог-канал",
        description: "Изменить никнейм участника.",
        usage: "[название текстового канала | упоминание | ID]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["dis-mod-log-channel", "омлк", "dmlc", "dislogc"]
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
      let sd = await serverModel.findOne({ serverID: message.guild.id });
        try {
            let a = sd.modLog;

            if (!a) {
                return message.channel.send(sembed.setDescription(`❌ Журнал модерации пока еще не установлен.`)).then(msg => {msg.delete({timeout: "10000"})});
            } else {
              let channel = message.guild.channels.cache.get(a);
                bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send(sembed.setDescription(`✅ Журнал модерации отключен на этом канале.`));
                await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {modLog: undefined}})

                message.channel.send(sembed.setDescription(`✅ Успешно отключен канал модерации.`));
            }
        } catch {
            return message.channel.send(logEmbed.setDescription("❌ Недостаточно прав, либо канал не существует.")).then(msg => {msg.delete({timeout: "10000"})});
        }
    }
};
