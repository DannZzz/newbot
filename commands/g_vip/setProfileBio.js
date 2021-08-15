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
    name: "профиль-био",
    description: "Поставить био на свою профиль.",
    category: "g_vip",
    aliases: ["set-bio"],
    accessableby: "Для всех",
    usage: "[ваше сообщение]"
  },
  run: async (bot, message, args) => {
    let bag = await begModel.findOne({userID: message.author.id});


    if(bag['vip1'] === false) return error(message, "Эта команда доступна только для **VIP 1** пользователей.");
    let arg = args.slice(" ").join(" ")
    if(!args[0]) return error(message, "Укажите текст.");

    embed(message).setSuccess('Успешно установленo новoe био профиля.').send()
    await vipModel.findOneAndUpdate({userID: message.author.id}, {$set: {profileBio: arg}})

  }
}
