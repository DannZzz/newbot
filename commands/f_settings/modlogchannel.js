const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");

module.exports = {
      config: {
        name: "мод-лог-канал",
        description: "Изменить никнейм участника.",
        usage: "[название текстового канала | упоминание | ID]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["mod-log-channel", "млк", "mlc", "logc"]
    },
    run: async (bot, message, args) => {
      let sembed = new MessageEmbed()
      .setTimestamp()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setColor(greenlight)

      if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
      if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
      let sd = await serverModel.findOne({ serverID: message.guild.id });
    if (!args[0]) {

      let b = await sd.modLog;
      let channelName = message.guild.channels.cache.get(b);
      if (message.guild.channels.cache.has(b)) {
        return message.channel.send(sembed.setDescription(
          `${AGREE} Журнал модерации установлен на: <#${channelName.id}>`
        ));
      } else
        return embed(message).setError(
          "Укажите доступный тектовый канал."
        ).send().then(msg => {msg.delete({timeout: "10000"})});
    }
        let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

        if (!channel || channel.type !== 'text') return embed(message).setError("Укажите доступный текстовый канал.").send().then(msg => {msg.delete({timeout: "10000"})});

        try {
            let a = sd.modLog;

            if (channel.id === a) {
                return message.channel.send(sembed.setDescription(`${AGREE} <#${channel.id}> этот канал уже установлен для модерации.`));
            } else {
                bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send(sembed.setDescription(`${AGREE} Журнал модерации установлен на этот канал.`));
                await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {modLog: channel.id}})

                message.channel.send(sembed.setDescription(`${AGREE} <#${channel.id}> установлен новый канал для модерации.`));
            }
        } catch {
            return embed(message).setError("Недостаточно прав, либо канал не существует.").send().then(msg => {msg.delete({timeout: "10000"})});
        }
    }
};
