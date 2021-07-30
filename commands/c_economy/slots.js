//const slotItems = ["🍇", "🍉", "🍌", "🍎", "🍒"];
const slotItems = ["<a:163:849994358828171296>", "<a:164:849994326025043988>", "<a:170:849994324577878037>", "<a:166:849994325831712798>", "<a:168:849994325441773588>"];
const embed = require('../../embedConstructor');
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK, AGREE, DISAGREE } = require('../../config');
const profileModel = require("../../models/profileSchema");
const begModel = require("../../models/begSchema");


module.exports = {
    config: {
        name:"слот",
        aliases: ["sl", "slots", "slot", "сл"],
        category: "c_economy",
        description: "Слот(slots) | 9x - редкие | 3x - обычные",
        usage: "[ставка]",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {

    let user = message.author;
    let profileData = await profileModel.findOne({ userID: user.id });
    let beg = await begModel.findOne({ userID: user.id });
    let moneydb = profileData.coins;
    let money = parseInt(args[0]);
    let win = false;


    let aembed = new MessageEmbed()
    .setColor(redlight)
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

    let timeout;
    if (beg["vip2"] === true) { timeout = 90 * 1000; } else {
      timeout = 180 * 1000;
    };

    let author = profileData.slots;
    if (author !== null && timeout - (Date.now() - author) > 0) {

      let time = new Date(timeout - (Date.now() - author));
      return embed(message).setError(`Попробуй снова через **${time.getMinutes()} минут ${time.getSeconds()} секунд**.`).send().then(msg => {msg.delete({timeout: "10000"})});
    } else {
      if (money < 100) return embed(message).setError(`Минимальная ставка **100**.`).send().then(msg => {msg.delete({timeout: "10000"})});
      if (!money) return embed(message).setError('Укажите ставку.').send();
      if (money > 100000) return embed(message).setError(`Максимальная ставка **100000**.`).send().then(msg => {msg.delete({timeout: "10000"})});
      if (money > moneydb) return embed(message).setError(`Укажите ставку.`).send();
      let reward = 0 ;
      let number = []

      await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(-money)}});
      for (let i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }

      if (number[0] == number[1] && number[1] == number[2])  {
          money = money * 3;
          win = true;
      } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
          money = money * 2;
          win = true;
      }
      if (win) {

          embed(message).setPrimary(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\n${AGREE} Ты выиграл ${money}${COIN}`).send()

          await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(money)}});
      } else {
          embed(message).setPrimary(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\n${DISAGREE} Ты проиграл ${money}${COIN}`).send()




      }
      await profileModel.findOneAndUpdate({userID: user.id},{$set: {slots: Date.now()}});

    }

}
}
