const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "эмбед",
    description: "Отправлять сообщение на указанном канале в формате EMBED.",
    category: "g_vip",
    aliases: ["embed"],
    accessableby: "Нужна права: Администратор.",
    usage: "[упоминание канала] [цвет] [ваше сообщение]"
  },
  run: async (bot, message, args) => {
    let bag = await begModel.findOne({userID: message.author.id});

    let channel = message.mentions.channels.first();
    if(bag["vip1"] === false) return embed(message).setError("Эта команда доступна только для **VIP 1** пользователей.").send().then(msg => {msg.delete({timeout: "10000"})});

    let arg = args.slice(2).join(" ")
    if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(!args[0]) return embed(message).setError("Укажите #текстовый канал.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(!args[1]) return embed(message).setError("Укажите цвет эмбед.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(!arg) return embed(message).setError("Укажите текст.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(!channel) return embed(message).setError("Укажите доступный #текстовый канал.").send().then(msg => {msg.delete({timeout: "10000"})});
    let doEmbed = new MessageEmbed()
    .setColor(`${args[1]}`)
    .setTimestamp()
    .setDescription(arg)

    channel.send(doEmbed)


  }
}
