const {MessageEmbed} = require('discord.js');
const profileModel = require("../../models/profileSchema")
const {cyan} = require('../../JSON/colours.json');
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

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
    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    let {member, channel} = message
    const profileData = await profileModel.findOne({userID: member.id});
    const emb = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
    .setColor(cyan)
    .setTimestamp()

    let toGuild = bot.guilds.cache.get('731032795509686332');
    let toChannel = toGuild.channels.cache.get('870408356723052655');

    let timeout = 1000 * 10 * 60;
    let author = profileData.bug;
    if (author !== null && timeout - (Date.now() - author) > 0) {

      let time = new Date(timeout - (Date.now() - author));
      return error(message, `Попробуй снова через **${time.getMinutes()} минут ${time.getSeconds()} секунд**.`);
    } else {
      if(!args[0]) return error(message, `Оставьте сообщение.`);
      embed(message, "Спасибо за отзыв, мы рассмотрим ваше сообщение.\nУбедитесь, что ваши личные сообщения открыты.")
      toChannel.send({embeds: [emb.setDescription(
        `
        **Получено от: **\`${member.user.tag}(${member.id})\`\n**Из сервера: **\`${message.guild.name}(${message.guild.id})\`\n\n**Сообщение:**\n\`${args.join(" ")}\`
        `
      )]})

      await profileModel.findOneAndUpdate({userID: member.id}, {$set: {bug: Date.now()}})
    }
  }
}
