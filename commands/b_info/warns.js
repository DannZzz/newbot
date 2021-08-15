const {MessageEmbed} = require("discord.js")
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const memberModel = require("../../models/memberSchema");
const serverModel = require("../../models/serverSchema");
const embed = require('../../embedConstructor');
const {error} = require('../../functions');

module.exports = {
  config: {
    name: "преды",
    description: "Посмотреть кол-во предупреждений участника.",
    usage: "[тег | никнейм | упоминание | ID] (По желанию)",
    category: "b_info",
    accessableby: "Для всех.",
    aliases: ["warns"]
  },
  run: async (bot, message, args) => {
    let toWarn = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

    if (toWarn.user.bot) return error(message, "Бот не может иметь предупреждения.");

    let data = await memberModel.findOne({
      userID: toWarn.id,
      serverID: message.guild.id
    })


    if (data && data.warns.length !== 0) {

      embed(message).setPrimary(`**${toWarn} имеет \`\`${data.warns.length}\`\` предупреждений.**\n\nИспользуйте команду \`\`?warns-list\`\` для больше информации.`).send()
    } else if (!data || data.warns.length === 0) {


      error(message, `${toWarn} не имеет предупреждений.`);
    }

  }
}
