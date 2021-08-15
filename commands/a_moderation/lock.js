const {PREFIX, AGREE} = require("../../config");
const {error} = require('../../functions');

module.exports = {
  config: {
    name: "закрыть",
    description: "Закрывать канал.",
    usage: "(название текстового канала | упоминание | ID)",
    category: "a_moderation",
    accessableby: "Нужна права: Администрация.",
    aliases: ["lock"]
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return error(message, "У меня недостаточно прав.");
    let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.channel;

    let ow = channel.permissionsFor(channel.guild.roles.everyone).has("SEND_MESSAGES")
    if(ow === false) return error(message, `${channel} и так закрыт!`);

    await channel.updateOverwrite(message.channel.guild.roles.everyone, {
      SEND_MESSAGES: false
    })


    message.channel.send(`${AGREE} ${channel} успешно закрыт.`)
  }
}
