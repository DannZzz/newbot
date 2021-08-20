module.exports = {
  config: {
    name: "аватар",
    aliases: ["av", "avatar"],
    category: "b_info",
    description: "Показывает аватарку участника.",
    usage: "[ник участника | упоминание | ID] (По желанию)",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

    if (args[0]) {
      message.channel.send({ embeds: [
        {

          title: `Аватар ${user.user.username}'`,

          color: 0x00deff,

          image: {
            url: `${user.user.displayAvatarURL({dynamic: true})}` + '?size=4096'
          },

          timestamp: new Date(),

          footer: {
            text: message.guild.name,
            icon_url: message.guild.iconURL()
          }
        }
      ]})
    }
    else if (!args[0]) {
      message.channel.send({embeds: [
        {

          title: `Аватар ${user.user.username}`,

          color: 0x00deff,

          image: {
            url: `${user.user.displayAvatarURL({ dynamic: true })}` + '?size=4096'
          },

          timestamp: new Date(),

          footer: {
            text: message.guild.name,
            icon_url: message.guild.iconURL()
          }

        }
      ]})
    }
  }
}
