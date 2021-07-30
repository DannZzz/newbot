const embed = require('../../embedConstructor');
const {AGREE} = require('../../config');
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const serverModel = require("../../models/serverSchema");

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
      if (!message.member.hasPermission("MANAGE_ROLES")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});

        try {
            let sd = await serverModel.findOne({ serverID: message.guild.id });
            let a = sd.muteRole;a

            if (!a) {
                return embed(message).setError("Роль мьюта пока не установлена.").send().then(msg => {msg.delete({timeout: "10000"})});
            } else {
              let dmtsEmbed = new MessageEmbed()
              .setTimestamp()
              .setColor(greenlight)
              .setAuthor(message.guild.name, message.guild.iconURL())
                let role = message.guild.roles.cache.get(a)
                await serverModel.findOneAndUpdate({serverID: message.guild.id},{$set: {muteRole: undefined}});

                message.channel.send(dmtsEmbed.setDescription(`${AGREE} **\`${role.name}\`** мьют роль успешно удалена`))
            }
            return;
        } catch {
          return embed(message).setError(
            "Ошибка: `Отсутствующие разрешения  или роль не существует.`",
            `\n${e.message}`
          ).send();
        }
    }
}
