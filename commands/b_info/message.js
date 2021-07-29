const {MessageEmbed} = require('discord.js');
const profileModel = require("../../models/profileSchema")
const {greenlight, redlight} = require('../../JSON/colours.json');

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
    let aembed = new MessageEmbed()
    .setColor(redlight)
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

    let {member, channel} = message
    const profileData = await profileModel.findOne({userID: member.id});
    if(!args[0]) return channel.send(aembed.setDescription(`❌ Оставьте сообщение.`)).then(msg => {msg.delete({timeout: "10000"})});

    let toGuild = bot.guilds.cache.get('731032795509686332');
    let toChannel = toGuild.channels.cache.get('870408356723052655');

    let timeout = 1000 * 30 * 60;
    let author = profileData.bug;
    if (author !== null && timeout - (Date.now() - author) > 0) {

      let time = new Date(timeout - (Date.now() - author));
      return channel.send(aembed.setDescription(`❌ Попробуй снова через **${time.getMinutes()} минут ${time.getSeconds()} секунд**.`)).then(msg => {msg.delete({timeout: "10000"})});
    } else {
      channel.send(aembed.setDescription("✅ Спасибо за отзыв, мы рассмотрим ваше сообщение."))
      toChannel.send(aembed.setDescription(
        `
        **Получено от: **\`${member.user.tag}\`\n**Из сервера: **\`${message.guild.name}\`\n\n**Сообщение:**\n\`${args.join(" ")}\`
        `
      ))

      await profileModel.findOneAndUpdate({userID: member.id}, {$set: {bug: Date.now()}})
    }
  }
}
