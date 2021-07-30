const { MessageEmbed } = require("discord.js");
const { greenlight, cyan, redlight } = require("../../JSON/colours.json")
const embed = require('../../embedConstructor');

module.exports = {
    config: {
        name: "скажи",
        category: "e_fun",
        aliases: ['say'],
        description: "Бот повторяет за вами.",
        usage: "[текст]",
        accessableby: "для всех"
    },
    run: async (bot, message, args) => {
      try {
        if (args.length === 0){
            return embed(message).setError("**Давайте немного текста!**").send().then(msg => {msg.delete({timeout: "10000"})});
      }
        embed(message).setPrimary(args.join(" ")).send()
      } catch (e) {
          throw e;
      };
  }
};
