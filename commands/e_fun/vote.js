const {MessageEmbed}  = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const ms = require("ms");
const mss = require("millisecond");
const embed = require('../../embedConstructor');
const {error} = require('../../functions');
const agree    = "✅";
const disagree = "❎";

module.exports = {
    config: {
      name: "голосование",
      description: "Создает голосование время.",
      usage: "[время 1m 1h, 1d] [сообщение]",
      category: "e_fun",
      accessableby: "Нужна роль: Администратор.",
      aliases: ['vote', 'гол']
    },
    run: async (bot, message, args) => {
      if (!message.member.hasPermission("ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
      if(!args[0]) return error(message, "Укажите время.");
      if(!ms(args[0]) || !isNaN(args[0])) return error(message, "Укажите время на английском. \`\`1m, 1h, 1d\`\`");
      if(!args[1]) return error(message, "Задайте вопрос голосовании.");
      // Number.isInteger(itime)
      //  if (e) return message.reply('please supply a valid time number in seconds')
      let dateTime = new Date(ms(args[0]))
      let time = mss(args[0]);
      if (time < 60000) return error(message, "Минимальное время голосований **1 минута**.");
      let data;
      if(time >= 3600000 && time < 8640000) {data = `(Время голосований: **${dateTime.getUTCHours()} часа(ов)**)`} else if(time >= 86400000) {data = `(Время голосований: **${time / 86400000} день(ей))**`}
      else {
        data = `(Время голосований: **${dateTime.getMinutes()} минут(а)**)`
      }
      message.delete();
      let msg = await embed(message).setPrimary(`Вопрос: **${message.content.split(" ").slice(2).join(" ")}** \n\nГолосуй сейчас! ` + data).send();

      await msg.react(agree);
      await msg.react(disagree);

      const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, {time: time});
      msg.delete();

      var NO_Count = reactions.get(disagree);
      var YES_Count = reactions.get(agree);

      if(YES_Count == undefined){
        var YES_Count = 1;
      }else{
        var YES_Count = reactions.get(agree).count;
      }

      if(NO_Count == undefined){
        var NO_Count = 1;
      }else{
        var NO_Count = reactions.get(disagree).count;
      }

      var nightcoreat = new MessageEmbed()

                .addField("Голосование окончено:", "----------------------------------------\n" +
                                              "Вопрос: **" + message.content.split(" ").slice(2).join(" ") + "**\n\n" +
                                              "Всего (✅): " + `\`\`${YES_Count-1}\n\`\`` +
                                              "Всего (❎): " + `\`\`${NO_Count-1}\n\`\`` +
                                              "----------------------------------------", true)

                .setColor(cyan)

      await message.channel.send(nightcoreat);
    }
}
