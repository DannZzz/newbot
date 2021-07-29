const { MessageEmbed } = require("discord.js")
const { cyan } = require("../../JSON/colours.json")
const moment = require('moment');

module.exports = {
    config: {
        name: "сервер",
        description: "Выдает информацию о сервере",
        usage: " ",
        category: "b_info",
        accessableby: "Для всех",
        aliases: ["server", 'serverinfo', 'си']
    },
    run: async (bot, message, args) => {
        try {
          let server = message.guild;
          let isItIn = function(val){
              if(val === true){
                return val;
              }
          }
          let agg = 0;

          const serverembed = new MessageEmbed()

          .setAuthor('Информация о сервере')
          .setTitle(server.name)
          .setThumbnail(server.iconURL({dynamic: true}))
          .addField('Создатель:', `\`\`\`${server.owner.user.tag}\n  \`\`\``, true)
          .addField('Вы зашли в:', `\`\`\`${moment(message.member.joinedAt).format('DD.MM.YYYY HH:mm')}\`\`\``, true)
          .addField('Создано в:', `\`\`\`${moment(server.createdAt).format('DD.MM.YYYY HH:mm')}\`\`\``, true)
          .addField('Верифицирован:', `\`\`\`${booleanToRus(server.verified)}\`\`\``, true)

          .addField('Участников:', `\`\`\`${server.memberCount}\`\`\``, true)
          .addField('Онлайн:', `\`\`\`${server.members.cache.filter(m => m.presence.status === "online").size}\`\`\``, true)
          .addField('Не беспокоить:', `\`\`\`${server.members.cache.filter(m => m.presence.status === "dnd").size}\`\`\``, true)
          .addField('Неактивен:', `\`\`\`${server.members.cache.filter(m => m.presence.status === "idle").size}\`\`\``, true)
          .addField('Оффлайн:', `\`\`\`${server.members.cache.filter(m => m.presence.status === "offline").size}\`\`\``, true)
          .addField('Категорий:', `\`\`\`${server.channels.cache.filter(c => c.type === "category").size}\`\`\``, true)
          .addField('#Текст. каналы:', `\`\`\`${server.channels.cache.filter(t => t.type === "text").size}\`\`\``, true)
          .addField('Голос. каналы:', `\`\`\`${server.channels.cache.filter(v => v.type === "voice").size}\`\`\``, true)
          .setFooter('ID: ' + server.id)

          .setTimestamp()
          .setColor(cyan)


          return message.channel.send(serverembed);
        }
        catch (r ){
            console.log(r);
        }
    }
}

function booleanToRus(val){
  if(val === true) {
    return "Да";
  } else {
    return "Нет";
  }
}
