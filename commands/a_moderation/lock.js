const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "закрыть",
    description: "Закрывать канал.",
    usage: "",
    category: "a_moderation",
    accessableby: "Нужна права: Администрация.",
    aliases: ["lock"]
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});

    let ow = message.channel.permissionsFor(message.channel.guild.roles.everyone).has("SEND_MESSAGES")
    if(ow === false) return embed(message).setError(`${message.channel} и так закрыт!`).send().then(msg => {msg.delete({timeout: "10000"})});

    await message.channel.updateOverwrite(message.channel.guild.roles.everyone, {
      SEND_MESSAGES: false
    })
    const sembed = new MessageEmbed()
        .setColor(greenlight)
        .setTimestamp()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`${AGREE} ${message.channel} успешно закрыт.`)

    message.channel.send(sembed)
  }
}
