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
    name: "профиль-эскиз",
    description: "Поставить эскиз на свою профиль.",
    category: "g_vip",
    aliases: ["set-thumbnail"],
    accessableby: "Для всех",
    usage: "[ссылка на фотку] (Можно и анимационную)"
  },
  run: async (bot, message, args) => {

    let bag = await begModel.findOne({userID: message.author.id});

    if(bag['vip1'] === false) return error(message, "Эта команда доступна только для **VIP 1** пользователей.");

    if(!args[0]) return error(message, "Укажите ссылку");

    embed(message).setSuccess('Успешно установлена новый эскиз профиля.').send()
    await vipModel.findOneAndUpdate({userID: message.author.id}, {$set: {profileThumbnail: args[0]}})

  }
}
