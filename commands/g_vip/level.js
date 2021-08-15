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

    if(bag['vip1'] === false) return error(message, "Эта команда доступна только для **VIP 1** пользователей.");
    if (!message.member.hasPermission("ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
    if(!args[0]) return error(message, "Укажите действие.\nПример: \`\`?уровни отключить\`\`");
    if (args[0] === "отключить" || args[0] === 'off') {
      if(sd.rank) {
        Levels.deleteGuild(message.guild.id);
        await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {rank: false}})
        embed(message).setSuccess('Система уровней успешно сброшена и отключена.').send()
      } else {
      return error(message, "Система уровней и так отключена.");
      }
    } else if (args[0] === "включить" || args[0] === 'on') {
      if(!sd.rank || sd.rank === null) {
        await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {rank: true}})
        embed(message).setSuccess('Система уровней успешно включена.').send()
      } else {
      return error(message, "Система уровней и так включена.");
      }
    } else  {
      return error(message, "Действие не найдено.");
    }

  }
}
