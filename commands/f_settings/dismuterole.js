
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const serverModel = require("../../serverSchema");


module.exports = {
    config: {
        name: "откл-мьют-роль",
        aliases: ['омр', 'dismuterole', 'dmr', 'dmrole'],
        category: 'f_settings',
        description: 'Отключить мьют роль сервера',
        usage: '[название роли | упоминание роли | ID роли]',
        accessableby: 'Нужна права: Управлять ролями.'
    },
    run: async (bot, message, args) => {
      let dmtEmbed = new MessageEmbed()
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
      .setColor(redlight)
      if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send(dmtEmbed.setDescription("❌ У вас недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(dmtEmbed.setDescription("❌ У меня недостаточно прав.")).then(msg => {msg.delete({timeout: "10000"})});

        try {
            let sd = await serverModel.findOne({ serverID: message.guild.id });
            let a = sd.muteRole;a

            if (!a) {
                return message.channel.send(dmtEmbed.setDescription("❌ Роль мьюта пока не установлена.")).then(msg => {msg.delete({timeout: "10000"})});
            } else {
              let dmtsEmbed = new MessageEmbed()
              .setTimestamp()
              .setColor(greenlight)
              .setAuthor(message.guild.name, message.guild.iconURL())
                let role = message.guild.roles.cache.get(a)
                await serverModel.findOneAndUpdate({serverID: message.guild.id},{$set: {muteRole: undefined}});

                message.channel.send(dmtsEmbed.setDescription(`✅ **\`${role.name}\`** мьют роль успешно удалена`))
            }
            return;
        } catch {
          return message.channel.send(dmtEmbed.setDescription(
            "Ошибка: `Отсутствующие разрешения  или роль не существует.`",
            `\n${e.message}`
          ));
        }
    }
}
