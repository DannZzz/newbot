const db = require("quick.db");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');

module.exports = {
  config: {
        name: "test",
        description: "nio",
        category: "economy",
        noalias: '',
        accessableby: "Для всех",
        usage: "[] "
  },
  run: async (bot, message, args) => {
    let embed = new MessageEmbed()
    .setDescription("DA YA TUT")

    let msg = await message.channel.send(embed)

    await msg.react("➡");

    let collector = msg.createReactionCollector(
      (reaction, user) => user.id === message.author.id
    );

    collector.on("collect", async (reaction, user) => {
      if (reaction._emoji.name === "➡") {
        embed.setDescription("neeee")

        msg.edit(embed)
      }
    })
  }
}
