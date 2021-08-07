const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR, MONGO } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');

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

    if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(!args[0]) return embed(message).setError("Укажите действие участника.").send().then(msg => {msg.delete({timeout: "10000"})});

    var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    if (!member) return embed(message).setError("Пользователь не в сервере.").send().then(msg => {msg.delete({timeout: "10000"})});

    Levels.deleteUser(member.user.id, message.guild.id);

    embed(message).setSuccess('Данные успешно удалены.').send()
  }
}
