const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');
module.exports = {
  config: {
    name: "открыть",
    description: "Открывать канал.",
    usage: "(название текстового канала | упоминание | ID)",
    category: "a_moderation",
    accessableby: "Нужна права: Администрация.",
    aliases: ["unlock"]
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
    let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.channel;

    let ow = channel.permissionsFor(channel.guild.roles.everyone).has("SEND_MESSAGES")
    if(ow === true || ow === null) return embed(message).setError(`${channel} и так открыт!`).send().then(msg => {msg.delete({timeout: "10000"})});


    await channel.updateOverwrite(message.channel.guild.roles.everyone, {
      SEND_MESSAGES: null
    })
    const sembed = new MessageEmbed()
        .setColor(greenlight)
        .setTimestamp()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`${AGREE} ${channel} успешно открыт.`)

    message.channel.send(sembed)
  }
}
