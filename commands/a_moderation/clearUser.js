const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR, MONGO } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');
const {error} = require('../../functions');
const Levels = require("discord-xp");
Levels.setURL(MONGO)

module.exports = {
  config: {
    name: "сбросить",
    description: "Обнулить ранг участника.",
    category: "a_moderation",
    aliases: ["throw"],
    accessableby: "Нужна права: Администратор.",
    usage: "[тег | никнейм | упоминание | ID]"
  },
  run: async (bot, message, args) => {
    let bag = await begModel.findOne({userID: message.author.id});
    let sd = await serverModel.findOne({serverID: message.guild.id});

    if (!message.member.hasPermission("ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
    if(!args[0]) return error(message, "Укажите действие участника.");

    var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    if (!member) {
      const User = await Levels.fetch(args[0], message.guild.id)
      if(!User.userID) return error(message, "Пользователь не найден.");
    }

    Levels.deleteUser(member ? member.user.id : args[0], message.guild.id);

    embed(message).setSuccess('Данные успешно удалены.').send()
  }
}
