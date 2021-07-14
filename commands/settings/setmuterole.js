const db = require('quick.db');
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");

module.exports = {
  config: {
    name: "мьют-роль",
    description: "Установить роль для мьюта.",
    usage: "[название роли | упоминание роли | ID роли]",
    category: "settings",
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

    if (!args[0]) {
      let b = await db.fetch(`muterole_${message.guild.id}`);
      let roleName = message.guild.roles.cache.get(b);
      if (message.guild.roles.cache.has(b)) {
        let mtsEmbed = new MessageEmbed()
        .setTimestamp()
        .setColor(greenlight)
        .setAuthor(message.guild.name, message.guild.iconURL())
        return message.channel.send(mtsEmbed.setDescription(`✅ Мьют роль для этого сервера: \`${roleName.name}\`!`)).then(msg => {msg.delete({timeout: "10000"})});
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
    let prefix = await db.fetch(`prefix_${message.guild.id}`)
    if(!prefix) return prefix = PREFIX;
    if (!role)
      return message.channel.send(mtEmbed.setDescription(`❌ Пожалуйста, укажите доступная роль!\n\`\`${prefix}хелп мьютроль\`\``)).then(msg => {msg.delete({timeout: "10000"})});

      try {
        let a = await db.fetch(`muterole_${message.guild.id}`);

        if (role.id === a) {
          return message.channel.send(mtEmbed.setDescription(`❌ Эта роль уже установлена.`)).then(msg => {msg.delete({timeout: "10000"})});
        } else {
          let mtsEmbed = new MessageEmbed()
          .setTimestamp()
          .setColor(greenlight)
          .setAuthor(message.guild.name, message.guild.iconURL())
          db.set(`muterole_${message.guild.id}`, role.id);

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
