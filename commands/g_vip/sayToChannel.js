const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "канал",
    description: "Отправлять сообщение на указанном канале.",
    category: "g_vip",
    aliases: ["channel"],
    accessableby: "Нужна права: Администратор.",
    usage: "[упоминание канала] [ваше сообщение]"
  },
  run: async (bot, message, args) => {
    let bag = await begModel.findOne({userID: message.author.id});

    let channel = message.mentions.channels.first();
    if(bag["vip1"] === false) return embed(message).setError("Эта команда доступна только для **VIP 1** пользователей.").send().then(msg => {msg.delete({timeout: "10000"})});

    let arg = args.slice(1).join(" ")
    if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(!args[0]) return embed(message).setError("Укажите #текстовый канал.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(!arg) return embed(message).setError("Укажите текст.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(!channel) return embed(message).setError("Укажите доступный #текстовый канал.").send().then(msg => {msg.delete({timeout: "10000"})});


    channel.send(arg)


  }
}
