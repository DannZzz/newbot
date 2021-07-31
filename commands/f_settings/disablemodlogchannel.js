const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");

module.exports = {
      config: {
        name: "откл-мод-лог-канал",
        description: "Изменить канал модерация.",
        usage: "[название текстового канала | упоминание | ID]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["dis-mod-log-channel", "омлк", "dmlc", "dislogc"]
    },
    run: async (bot, message, args) => {

      if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
      if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
      let sd = await serverModel.findOne({ serverID: message.guild.id });
        try {
            let a = sd.modLog;

            if (!a) {
                return embed(message).setPrimary(`Журнал модерации пока еще не установлен.`).send().then(msg => {msg.delete({timeout: "10000"})});
            } else {
              let channel = message.guild.channels.cache.get(a);
                bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send(embed(message).setSuccess(`Журнал модерации отключен на этом канале.`));
                await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {modLog: undefined}})

                embed(message).setSuccess(`Успешно отключен канал модерации.`).send();
            }
        } catch {
            return embed(message).setError("Недостаточно прав, либо канал не существует.").send().then(msg => {msg.delete({timeout: "10000"})});
        }
    }
};
