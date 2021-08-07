const {MessageEmbed} = require("discord.js")
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const memberModel = require("../../models/memberSchema");
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "пред-лист",
    description: "Посмотреть список предупреждений участника.",
    usage: "[тег | никнейм | упоминание | ID] (По желанию)",
    category: "b_info",
    accessableby: "Для всех.",
    aliases: ["warns-list"]
  },
  run: async (bot, message, args) => {
    let toWarn = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
    let warnEmbed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(toWarn.user.tag, toWarn.user.displayAvatarURL({dynamic: true}))
    .setColor(redlight)

    let sembed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(toWarn.user.tag, toWarn.user.displayAvatarURL({dynamic: true}))
    .setColor(cyan)


    if (toWarn.user.bot) return embed(message).setError("Бот не может иметь предупреждения.").send().then(msg => {msg.delete({timeout: "10000"})});

    let data = await memberModel.findOne({
      userID: toWarn.id,
      serverID: message.guild.id
    })


    if (data && data.warns.length !== 0) {
      let mappedData = data.warns.map(
        ({Moderator, Reason, Date}, pos) => `__${pos+1}.__ Модератор: <@${Moderator}>\nПричина: \`\`${Reason}\`\`\nДата: \`${Date} по мск.\`\n`
      );


      embed(message).setPrimary(mappedData).send();
    } else if (!data || data.warns.length === 0) {


      embed(message).setError(`${toWarn} не имеет предупреждений.`).send();
    }

  }
}
