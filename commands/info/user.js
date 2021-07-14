const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../JSON/colours.json");
const moment = require('moment');

module.exports = {
    config: {
        name: "участник",
        category: "info",
        aliases: ["инфо", "уи", "user", "info"],
        description: "Выдает информацию об участнике",
        usage: "[тег | никнейм | упоминание | ID]",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {
        let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
        let UIembed = new MessageEmbed()
        .setTimestamp()
        .setColor(cyan)
        if(!member)
        return message.channel.send(UIembed.setDescription("❌ Участник не найден")).then(msg => {msg.delete({timeout: "10000"})});

        function statusToRus(ups){
          if(ups === "dnd"){
            return ups = "🔴 Не беспокоить";
          } else if(ups === "idle"){
            return ups = '🟡 Неактивен';
          } else if (ups === "online") {
            return ups = "🟢 Онлайн";
          } else {
            return ups = "💀 Оффлайн";
          }

        }

        const activities = [];
    for (const activity of member.presence.activities.values()) {
      switch (activity.type) {
        case 'CUSTOM_STATUS':
        activities.push(activity.state)
          UIembed.setDescription(`🌷 **Польз. статус:** ${activities}`)
          break;
        case 'PLAYING':
          UIembed.addField(`🎮 Играет в:`, `${activity.name}`, false);
          break;
        case 'LISTENING':
          if (member.bot) {UIembed.addField("<:spotify:864446494463885312> Слушает:", `${activity.name}`, false);}
          else {UIembed.addField(`<:spotify:864448063204360213> Слушает:`, `${activity.state} -- **${activity.details}**`, false)};
          break;//
        case 'WATCHING':
            UIembed.addField(`👀 Смотрит:`, `${activity.name}`, false);
          break;
        case 'STREAMING':
            UIembed.addField(`💻 Стримит:`, `${activity.name}`, false);
          break;
      }}



        UIembed.setTitle('📋 Имя пользователя: ' + member.user.tag)
        UIembed.setAuthor('Информация об участнике')
        UIembed.addField('👋 Дата регистрации:', moment(member.user.createdAt).format('DD.MM.YYYY HH:mm'), true)
        UIembed.addField('🎉 Присоединился:', moment(member.joinedAt).format('DD.MM.YYYY HH:mm'), true)
        UIembed.addField('🤖 Бот ли?:', booleanToRus(member.user.bot), true)
        UIembed.addField('🚩 Кол-во ролей на сервере:', member.roles.cache.size-1, true)
        UIembed.addField('🙌 Самая высокая роль:', member.roles.highest.name, true)
        UIembed.addField('📱 Статус:', statusToRus(member.user.presence.status), true)

        UIembed.setFooter(`ID: ${member.user.id}`)

        UIembed.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

        // user.presence.activities.forEach((activity) => {
        //       if (activity.type === 'CUSTOM_STATUS') {
        //           UIembed.addField('Currently playing',`\n**${activity.name}**`)
        //       } //
        //           })


        message.channel.send(UIembed);
    }
}

function booleanToRus(val){
  if(val === true) {
    return "Да";
  } else {
    return "Нет";
  }
}
