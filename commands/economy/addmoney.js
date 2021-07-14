const db = require("quick.db");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN } = require('../../config');
let ownerID = '382906068319076372';

module.exports = {
  config: {
    name: "добавить",
    description: "Добавить кол-во денег участнику.",
    category: "economy",
    aliases: ["addm", "addmoney", "доб"],
    accessableby: "Для разработчика.",
    usage: "[никнейм участника | упоминание | ID] [кол-во монет] "
  },
  run: async (bot, message, args) => {
     let addEmbed = new MessageEmbed()
     .setColor(redlight)
     .setTimestamp()
     .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

     if(message.member.user.id !== ownerID) return message.channel.send(addEmbed.setDescription("❌ К сожалению вы не разработчик.")).then(msg => {msg.delete({timeout: "10000"})});
    if (!args[0]) return message.channel.send(addEmbed.setDescription("❌ Укажите участника.")).then(msg => {msg.delete({timeout: "10000"})});

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    if(!args[1]) return message.channel.send(addEmbed.setDescription("❌ Укажите кол-во монет, чтобы добавить.")).then(msg => {msg.delete({timeout: "10000"})});
    if(isNaN(args[1])) return message.channel.send(addEmbed.setDescription("❌ Укажите кол-во монет в виде, чтобы добавить.")).then(msg => {msg.delete({timeout: "10000"})});
    if(args[1] > 10000) return message.channel.send(addEmbed.setDescription("❌ Укажите число меньше **10000**.")).then(msg => {msg.delete({timeout: "10000"})});

    db.add(`bank_${user.id}`, args[1]);

    let bal = await db.fetch(`money_${user.id}`);

    let sEmbed = new MessageEmbed()
    .setColor(greenlight)
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

    message.channel.send(sEmbed.setDescription(`Изменение баланса: Добавление <@${user.id}>\n\nДобавлено: ${COIN}**${args[1]}**`));
  }
}
