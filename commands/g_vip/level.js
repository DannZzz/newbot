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
    name: "уровни",
    description: "Включить/отключить систему уровней.",
    category: "g_vip",
    aliases: ["levels"],
    accessableby: "Нужна права: Администратор.",
    usage: "[отключить || off || включить || on]"
  },
  run: async (bot, message, args) => {
    let bag = await begModel.findOne({userID: message.author.id});
    let sd = await serverModel.findOne({serverID: message.guild.id});

    if(bag['vip1'] === false) return embed(message).setError("Эта команда доступна только для **VIP 1** пользователей.").send().then(msg => {msg.delete({timeout: "10000"})});
    if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(!args[0]) return embed(message).setError("Укажите действие.\nПример: \`\`?уровни отключить\`\`").send().then(msg => {msg.delete({timeout: "10000"})});
    if (args[0] === "отключить" || args[0] === 'off') {
      if(sd.rank) {
        Levels.deleteGuild(message.guild.id);
        await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {rank: false}})
        embed(message).setSuccess('Система уровней успешно сброшена и отключена.').send()
      } else {
      return embed(message).setError("Система уровней и так отключена.").send().then(msg => {msg.delete({timeout: "10000"})});
      }
    } else if (args[0] === "включить" || args[0] === 'on') {
      if(!sd.rank || sd.rank === null) {
        await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {rank: true}})
        embed(message).setSuccess('Система уровней успешно включена.').send()
      } else {
      return embed(message).setError("Система уровней и так включена.").send().then(msg => {msg.delete({timeout: "10000"})});
      }
    } else  {
      return embed(message).setError("Действие не найдено.").send().then(msg => {msg.delete({timeout: "10000"})});
    }

  }
}
