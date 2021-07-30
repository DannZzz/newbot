const { MessageEmbed } = require('discord.js');
const { giphy_API, DISAGREE } = require('../../config.js');
const giphy = require('giphy-api')(giphy_API);
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');

module.exports = {
    config: {
        name: 'гиф',
        category: 'e_fun',
        aliases: ['search-gif', 'gif'],
        description: 'Укажи тему, и я найду гифку!',
        usage: "[тема]",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {
      const noEmbed = new MessageEmbed()
      .setColor(redlight)
      .setTimestamp()
        if (!args[0]) {
            const embed = new MessageEmbed()
                .setColor(redlight)
                .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
                .setDescription(`${DISAGREE} **Укажите тему!**`)
            return message.channel.send(embed).then(msg => {msg.delete({timeout: "10000"})});
        }
      try {
        giphy.search(args.join(' ')).then(function (res) {
            let id = res.data[0].id;
            let url = `https://media.giphy.com/media/${id}/giphy.gif`;
            const embed = {
                color: 'cyan',
                timestamp: new Date(),
                footer: {
                    text: message.guild.name,
                    icon_url: message.guild.iconURL()
                  },
                  image: {
                      url: url
                  }
            };
            message.channel.send({ embed });
        });
      } catch {
          return message.channel.send(noEmbed.setDescription(`${DISAGREE} **Не найдено!**`)).then(msg => {msg.delete({timeout: "10000"})});
      }
    }
};
