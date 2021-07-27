
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const serverModel = require("../../models/serverSchema");


module.exports = {
  config: {
    name: "мьют-роль",
    description: "Установить роль для мьюта.",
    usage: "[название роли | упоминание роли | ID роли]",
    category: "f_settings",
    accessableby: "Нужна права: Управлять ролями.",
    aliases: ["muterole", "mr", "мр"]
  },
  run: async (bot, message, args) => {
    let mtEmbed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
    .setColor(redlight)
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send(mtEmbed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(mtEmbed.setDescription("❌ У меня недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
    let sd = await serverModel.findOne({ serverID: message.guild.id });
    if (!args[0]) {
      let b = sd.muteRole;
      let roleName = message.guild.roles.cache.get(b);
      if (message.guild.roles.cache.has(b)) {
        let mtsEmbed = new MessageEmbed()
        .setTimestamp()
        .setColor(greenlight)
        .setAuthor(message.guild.name, message.guild.iconURL())
        return message.channel.send(mtsEmbed.setDescription(`✅ Мьют роль для этого сервера: \`${roleName.name}\`!`))
      } else {
        return message.channel.send(mtEmbed.setDescription("❌ Пожалуйста, укажите название роли или ID роли.")).then(msg => {msg.delete({timeout: "10000"})});
      }
    };

    let role =
      message.mentions.roles.first() ||
      bot.guilds.cache.get(message.guild.id).roles.cache.get(args[0]) ||
      message.guild.roles.cache.find(
        c => c.name.toLowerCase() === args.join(" ").toLocaleLowerCase()
      );

    if (!role)
      return message.channel.send(mtEmbed.setDescription(`❌ Пожалуйста, укажите доступную роль!`)).then(msg => {msg.delete({timeout: "10000"})});

      try {
        let perms = role.permissions.serialize()
        if(perms.ADMINISTRATOR === true || perms.MANAGE_ROLES === true) return message.channel.send(mtEmbed.setDescription(`❌ Эта роль не может быть установлен для мьюта.`)).then(msg => {msg.delete({timeout: "10000"})});
        let a = sd.muteRole;

        if (role.id === a) {
          return message.channel.send(mtEmbed.setDescription(`❌ Эта роль уже установлена.`)).then(msg => {msg.delete({timeout: "10000"})});
        } else {
          let mtsEmbed = new MessageEmbed()
          .setTimestamp()
          .setColor(greenlight)
          .setAuthor(message.guild.name, message.guild.iconURL())
          await serverModel.findOneAndUpdate({serverID: message.guild.id},{$set: {muteRole: role.id}});


          message.channel.send(mtsEmbed.setDescription(
            `✅ **\`${role.name}\` успешно установлена новая роль мьюта!**`
          ));
        }
      } catch (e) {
        return message.channel.send(mtEmbed.setDescription(
          "Ошибка: `Отсутствующие разрешения  или роль не существует.`",
          `\n${e.message}`
        ));
      }
  }
}
