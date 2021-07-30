const profileModel = require("../../models/profileSchema");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN } = require('../../config');
let ownerID = '382906068319076372';
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "devmessage",
    description: "",
    category: "",
    aliases: "",
    accessableby: "Для разработчика.",
    usage: "[ID] [сообщение] "
  },
  run: async (bot, message, args) => {
     if(message.member.user.id !== ownerID) return embed(message).setError("К сожалению вы не разработчик.").send().then(msg => {msg.delete({timeout: "10000"})});
    if (!args[0]) return embed(message).setError("Укажите участника.").send().then(msg => {msg.delete({timeout: "10000"})});

    let user = bot.users.cache.get(args[0]);
    if (!user) {
      return embed(message).setError("Участник не найден.").send().then(msg => {msg.delete({timeout: "10000"})});
    }

    if(!args[1]) return embed(message).setError("Сообщение?").send().then(msg => {msg.delete({timeout: "10000"})});

    let msg = user.send(embed(message).setPrimary(`**У вас сообщение от разработчика!👀**\n\n||**${args.slice(1).join(" ")}**||`))



  }
}
