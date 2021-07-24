const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const serverModel = require("../../models/serverSchema");

module.exports = {
  config: {
    name: "закрыть",
    description: "Закрывать канал.",
    usage: "",
    category: "a_moderation",
    accessableby: "Нужна права: Управлять каналами.",
    aliases: ["lock"]
  },
  run: async (bot, message, args) => {
    let lockEmbed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
    .setColor(redlight)

    if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(lockEmbed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(lockEmbed.setDescription("❌ У меня недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});

    let ow = message.channel.permissionsFor(message.channel.guild.roles.everyone).has("SEND_MESSAGES")
    if(ow === false) return message.channel.send(lockEmbed.setDescription(`${message.channel} и так закрыт!`)).then(msg => {msg.delete({timeout: "10000"})});

    await message.channel.updateOverwrite(message.channel.guild.roles.everyone, {
      SEND_MESSAGES: false
    })
    const sembed = new MessageEmbed()
        .setColor(greenlight)
        .setTimestamp()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`${message.channel} успешно закрыт.`)

    message.channel.send(sembed)
  }
}
