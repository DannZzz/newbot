const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../JSON/colours.json");
const omg = require("../../models/customSchema");
const moment = require('moment');

module.exports = {
    config: {
        name: "сервер",
        description: "Выдает информацию о сервере.",
        usage: "",
        category: "b_info",
        accessableby: "Для всех",
        aliases: ["server", 'serverinfo', 'си']
    },
    run: async (bot, messageCreate, args) => {
      let message = messageCreate
        try {
          let server = message.guild;
          let isItIn = function(val){
              if(val === true){
                return val;
              }
          }
          let agg = 0;

          let all =  server.members.cache.filter(m => m.presence?.status === "online").size + server.members.cache.filter(m => m.presence?.status === "dnd").size + server.members.cache.filter(m => m.presence?.status === "idle").size

          const serverembed = new MessageEmbed()

          .setAuthor('Информация о сервере')
          .setTitle(server.name)
          .setThumbnail(server.iconURL({dynamic: true}))
          .addField('Каналы:', `\`\`\`T: ${server.channels.cache.filter(t => t.type === "GUILD_TEXT").size}\nV: ${server.channels.cache.filter(v => v.type === "GUILD_VOICE").size}\`\`\``, true)
          .addField('Вы зашли в:', `\`\`\`${moment(message.member.joinedAt).format('DD.MM.YYYY HH:mm')}\`\`\``, true)
          .addField('Создано в:', `\`\`\`${moment(server.createdAt).format('DD.MM.YYYY HH:mm')}\`\`\``, true)
          .addField('Создатель:', `\`\`\`${bot.users.cache.get(server.ownerId).tag}\`\`\``, true)


          .addField('Участников:', `\`\`\`${server.memberCount}\`\`\``, true)
          .addField('Онлайн:', `\`\`\`${all}\`\`\``, true)
          // .addField('Онлайн:', `\`\`\`${server.members.cache.filter(m => m.presence.status === "online").size}\`\`\``, true)
          // .addField('Не беспокоить:', `\`\`\`${server.members.cache.filter(m => m.presence.status === "dnd").size}\`\`\``, true)
          // .addField('Неактивен:', `\`\`\`${server.members.cache.filter(m => m.presence.status === "idle").size}\`\`\``, true)
          .addField('Оффлайн:', `\`\`\`${server.memberCount - all}\`\`\``, true)
          .addField('Категорий:', `\`\`\`${server.channels.cache.filter(c => c.type === "GUILD_CATEGORY").size}\`\`\``, true)

          .addField('Верифицирован:', `\`\`\`${booleanToRus(server.verified)}\`\`\``, true)
          .setFooter('ID: ' + server.id)

          .setTimestamp()
          .setColor(cyan)

          const data = await omg.find({serverID: message.guild.id});
          const filteredData = data.filter(function({command}) {
            return command
          }).map(({command}) => command).join(', ')
          if(filteredData.length !== 0) serverembed.addField('Пользовательские команды.', '\`\`\`' + filteredData + '\`\`\`', false)
          return message.channel.send({embeds: [serverembed]});
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
