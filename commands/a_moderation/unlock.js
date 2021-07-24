const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const serverModel = require("../../models/serverSchema");

module.exports = {
  config: {
    name: "открыть",
    description: "Открывать канал.",
    usage: "",
    category: "a_moderation",
    accessableby: "Нужна права: Администрация.",
    aliases: ["unlock"]
  },
  run: async (bot, message, args) => {
    let lockEmbed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
    .setColor(redlight)

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(lockEmbed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(lockEmbed.setDescription("❌ У меня недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});

    let ow = message.channel.permissionsFor(message.channel.guild.roles.everyone).has("SEND_MESSAGES")
    if(ow === true || ow === null) return message.channel.send(lockEmbed.setDescription(`${message.channel} и так открыт!`)).then(msg => {msg.delete({timeout: "10000"})});


    await message.channel.updateOverwrite(message.channel.guild.roles.everyone, {
      SEND_MESSAGES: null
    })
    const sembed = new MessageEmbed()
        .setColor(greenlight)
        .setTimestamp()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`${message.channel} успешно открыт.`)

    message.channel.send(sembed)
  }
}
