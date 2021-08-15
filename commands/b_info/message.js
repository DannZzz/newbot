const {MessageEmbed} = require('discord.js');
const profileModel = require("../../models/profileSchema")
const {greenlight, redlight} = require('../../JSON/colours.json');
const embed = require('../../embedConstructor');
const {error} = require('../../functions');

module.exports = {
  config: {
    name: 'сообщение',
    aliases: ["bug", 'message', "баг"],
    usage: '[ваше сообщение]',
    description: "Оставить отзыв разработчику бота.",
    category: 'b_info',
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let {member, channel} = message
    const profileData = await profileModel.findOne({userID: member.id});


    let toGuild = bot.guilds.cache.get('731032795509686332');
    let toChannel = toGuild.channels.cache.get('870408356723052655');

    let timeout = 1000 * 10 * 60;
    let author = profileData.bug;
    if (author !== null && timeout - (Date.now() - author) > 0) {

      let time = new Date(timeout - (Date.now() - author));
      return error(message, `Попробуй снова через **${time.getMinutes()} минут ${time.getSeconds()} секунд**.`);
    } else {
      if(!args[0]) return error(message, `Оставьте сообщение.`);
      embed(message).setSuccess("Спасибо за отзыв, мы рассмотрим ваше сообщение.").send()
      toChannel.send(embed(message).setPrimary(
        `
        **Получено от: **\`${member.user.tag}(${member.id})\`\n**Из сервера: **\`${message.guild.name}(${message.guild.id})\`\n\n**Сообщение:**\n\`${args.join(" ")}\`
        `
      ))

      await profileModel.findOneAndUpdate({userID: member.id}, {$set: {bug: Date.now()}})
    }
  }
}
