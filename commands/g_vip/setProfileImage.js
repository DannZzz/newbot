const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "профиль-картина",
    description: "Поставить фоточку на свою профиль.",
    category: "g_vip",
    aliases: ["set-image"],
    accessableby: "Для всех",
    usage: "[ссылка на фотку] (Можно и анимационную)"
  },
  run: async (bot, message, args) => {

    let bag = await begModel.findOne({userID: message.author.id});

    if(bag['vip1'] === false || bag['vip2'] === false) return embed(message).setError("Эта команда доступна только для **VIP 2** пользователей.").send().then(msg => {msg.delete({timeout: "10000"})});

    if(!args[0]) return embed(message).setError("Укажите ссылку").send().then(msg => {msg.delete({timeout: "10000"})});

    embed(message).setSuccess('Успешно установлена новая картинка профиля.').send()
    await vipModel.findOneAndUpdate({userID: message.author.id}, {$set: {profileImage: args[0]}})

  }
}
