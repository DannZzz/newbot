const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');
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

    if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});

    let ow = message.channel.permissionsFor(message.channel.guild.roles.everyone).has("SEND_MESSAGES")
    if(ow === true || ow === null) return embed(message).setError(`${message.channel} и так открыт!`).send().then(msg => {msg.delete({timeout: "10000"})});


    await message.channel.updateOverwrite(message.channel.guild.roles.everyone, {
      SEND_MESSAGES: null
    })
    const sembed = new MessageEmbed()
        .setColor(greenlight)
        .setTimestamp()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`${AGREE} ${message.channel} успешно открыт.`)

    message.channel.send(sembed)
  }
}
