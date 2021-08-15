const embed = require('../../embedConstructor');
const {AGREE} = require('../../config');
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const serverModel = require("../../models/serverSchema");
const {error} = require('../../functions');

module.exports = {
    config: {
        name: "откл-мьют-роль",
        aliases: ['омр', 'dismuterole', 'dmr', 'dmrole'],
        category: 'f_settings',
        description: 'Отключить мьют роль сервера.',
        usage: '[название роли | упоминание роли | ID роли]',
        accessableby: 'Нужна права: Управлять ролями.'
    },
    run: async (bot, message, args) => {
      if (!message.member.hasPermission("MANAGE_ROLES")) return error(message, "У вас недостаточно прав.");
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) return error(message, "У меня недостаточно прав.");

        try {
            let sd = await serverModel.findOne({ serverID: message.guild.id });
            let a = sd.muteRole;a

            if (!a) {
                return error(message, "Роль мьюта пока не установлена.");
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
          return error(message, "Ошибка: `Отсутствующие разрешения  или роль не существует.`")
        }
    }
}
