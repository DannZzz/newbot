const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../JSON/colours.json");
const moment = require('moment');
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
    config: {
        name: "участник",
        category: "b_info",
        aliases: ["инфо", "уи", "user", "info"],
        description: "Выдает информацию об участнике.",
        usage: "[тег | никнейм | упоминание | ID]",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return

        let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
        let UIembed = new MessageEmbed()
        .setTimestamp()
        .setColor(cyan)
        if(!member)
        return error(message, "Участник не найден");

        function statusToRus(ups){
          if(ups === "dnd"){
            return ups = "Не беспокоить";
          } else if(ups === "idle"){
            return ups = 'Неактивен';
          } else if (ups === "online") {
            return ups = "Онлайн";
          } else {
            return ups = "Оффлайн";
          }

        }

        const activities = [];
    for (const activity of member.presence.activities.values()) {
      switch (activity.type) {
        case 'CUSTOM':
        activities.push(activity.state)
          UIembed.setDescription(`**Польз. статус:** \`\`\`${activities}\`\`\``)
          break;
        case 'PLAYING':
          UIembed.addField(`**Играет в:**`, `\`\`\`${activity.name}\`\`\``, false);
          break;
        case 'LISTENING':
          if (member.bot) {UIembed.addField("Слушает:", `\`\`\`${activity.name}\`\`\``, false);}
          else {UIembed.addField(`Слушает:`, `\`\`\`${activity.state} -- ${activity.details}\`\`\``, false)};
          break;//
        case 'WATCHING':
            UIembed.addField(`**Смотрит:**`, `\`\`\`${activity.name}\`\`\``, false);
          break;
        case 'STREAMING':
            UIembed.addField(`**Стримит:**`, `\`\`\`${activity.name}\`\`\``, false);
          break;
      }}



        UIembed.setTitle('Имя пользователя: \`\`\`' + member.user.tag + '\`\`\`')
        UIembed.setAuthor('Информация об участнике')
        UIembed.addField('Дата регистрации:', `\`\`\`${moment(member.user.createdAt).format('DD.MM.YYYY HH:mm')}\`\`\``, true)
        UIembed.addField('Присоединился:', `\`\`\`${moment(member.joinedAt).format('DD.MM.YYYY HH:mm')}\`\`\``, true)
        UIembed.addField('\u200B', '\u200B', true);
        UIembed.addField('Кол-во ролей:', `\`\`\`${member.roles.cache.size-1}\`\`\``, true)
        UIembed.addField('Самая высокая роль:', `\`\`\`${member.roles.highest.name}\`\`\``, true)
        UIembed.addField('\u200B', '\u200B', true);
        // UIembed.addField('Бот ли?:', `\`\`\`${booleanToRus(member.user.bot)}\`\`\``, true)
        // UIembed.addField('Статус:', `\`\`\`${statusToRus(member.user.presence.status)}\`\`\``, true)
        // UIembed.addField('\u200B', '\u200B', true);


        UIembed.setFooter(`ID: ${member.user.id}`)

        UIembed.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

        // user.presence.activities.forEach((activity) => {
        //       if (activity.type === 'CUSTOM_STATUS') {
        //           UIembed.addField('Currently playing',`\n**${activity.name}**`)
        //       } //
        //           })


        message.channel.send({embeds: [UIembed]});
    }
}

function booleanToRus(val){
  if(val === true) {
    return "Да";
  } else {
    return "Нет";
  }
}
