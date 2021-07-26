const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR, MONGO } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");
const serverModel = require("../../models/serverSchema");

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
    let embed = new MessageEmbed()
      .setColor(redlight)
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

    let sembed = new MessageEmbed()
       .setColor(greenlight)
       .setTimestamp()
       .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

    let bag = await begModel.findOne({userID: message.author.id});
    let sd = await serverModel.findOne({serverID: message.guild.id});

    if(bag['vip1'] === false) return message.channel.send(embed.setDescription("❌ Эта команда доступна только для **VIP 1** пользователей.")).then(msg => {msg.delete({timeout: "10000"})});
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
    if(!args[0]) return message.channel.send(embed.setDescription("❌ Укажите действие.\nПример: \`\`?уровни отключить\`\`")).then(msg => {msg.delete({timeout: "10000"})});
    if (args[0] === "отключить" || args[0] === 'off') {
      if(sd.rank) {
        Levels.deleteGuild(message.guild.id);
        await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {rank: false}})
        message.channel.send(sembed.setDescription('✅ Система уровней успешно сброшена и отключена.'))
      } else {
      return message.channel.send(embed.setDescription("❌ Система уровней и так отключена.")).then(msg => {msg.delete({timeout: "10000"})});
      }
    } else if (args[0] === "включить" || args[0] === 'on') {
      if(!sd.rank || sd.rank === null) {
        await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {rank: true}})
        message.channel.send(sembed.setDescription('✅ Система уровней успешно включена.'))
      } else {
      return message.channel.send(embed.setDescription("❌ Система уровней и так включена.")).then(msg => {msg.delete({timeout: "10000"})});
      }
    } else  {
      return message.channel.send(embed.setDescription("❌ Действие не найдено.")).then(msg => {msg.delete({timeout: "10000"})});
    }

  }
}
