const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");
const embed = require('../../embedConstructor');
const {error} = require('../../functions');

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
    if(bag["vip1"] === false) return error(message, "Эта команда доступна только для **VIP 1** пользователей.");

    let arg = args.slice(1).join(" ")
    if (!message.member.hasPermission("ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
    if(!args[0]) return error(message, "Укажите #текстовый канал.");
    if(!arg) return error(message, "Укажите текст.");
    if(!channel) return error(message, "Укажите доступный #текстовый канал.");


    channel.send(arg)


  }
}
