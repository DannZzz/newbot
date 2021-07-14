const { MessageEmbed } = require("discord.js");
const { greenlight, cyan, redlight } = require("../../JSON/colours.json")

module.exports = {
    config: {
        name: "скажи",
        category: "fun",
        aliases: ['say'],
        description: "Бот повторяет за вами.",
        usage: "[текст]",
        accessableby: "для всех"
    },
    run: async (bot, message, args) => {
      try {
        if (args.length === 0){
            const sayEmbed = new MessageEmbed()
            .setColor(redlight)
            .setTimestamp()
            .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
            return message.channel.send(sayEmbed.setDescription("**Давайте немного текста!**")).then(msg => {msg.delete({timeout: "10000"})});
      }

        const embed = new MessageEmbed()
            .setFooter(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
            .setDescription(args.join(" "))
            .setColor(cyan);

        message.channel.send(embed)
      } catch (e) {
          throw e;
      };
  }
};
