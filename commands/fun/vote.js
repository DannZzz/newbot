const {MessageEmbed}  = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const ms = require("ms");
const mss = require("millisecond");

const agree    = "✅";
const disagree = "❎";

module.exports = {
    config: {
      name: "vote",
      description: "Выдает информацию о сервере",
      usage: "[время 1m 1h, 1d] ",
      category: "fun",
      accessableby: "Для всех",
      aliases: ['вот']
    },
    run: async (bot, message, args) => {
      let nembed = new MessageEmbed()
      .setColor(redlight)
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

      if(!args[0]) return message.channel.send(nembed.setDescription("❌ Укажите время.")).then(msg => {msg.delete({timeout: "10000"})});
      if(!ms(args[0]) || !isNaN(args[0])) return message.channel.send(nembed.setDescription("❌ Укажите время на английском. \`\`1m, 1h, 1d\`\`")).then(msg => {msg.delete({timeout: "10000"})});
      if(!args[1]) return message.channel.send(nembed.setDescription("❌ Задайте вопрос голосовании.")).then(msg => {msg.delete({timeout: "10000"})});
      // Number.isInteger(itime)
      //  if (e) return message.reply('please supply a valid time number in seconds')
      let dateTime = new Date(ms(args[0]))
      let time = mss(args[0]);
      if (time < 60000) return message.channel.send(nembed.setDescription("❌ Минимальное время голосований **1 минута**.")).then(msg => {msg.delete({timeout: "10000"})});
      let data;
      if(time >= 3600000 && time < 8640000) {data = `(Время голосований: **${dateTime.getUTCHours()} часа(ов)**)`} else if(time >= 86400000) {data = `(Время голосований: **${time / 86400000} день(ей))**`}
      else {
        data = `(Время голосований: **${dateTime.getMinutes()} минут(а)**)`
      }
      let gembed = new MessageEmbed()
      .setColor(greenlight)
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

      message.delete();
      let msg = await message.channel.send(gembed.setDescription(`Вопрос: **${message.content.split(" ").slice(2).join(" ")}** \n\nГолосуй сейчас! ` + data));

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
