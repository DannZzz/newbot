const slotItems = ["🍇", "🍉", "🍌", "🍎", "🍒"];

const { MessageEmbed } = require('discord.js');
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const profileModel = require("../../models/profileSchema");


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
    let moneydb = profileData.coins;
    let money = parseInt(args[0]);
    let win = false;

    let moneymore = new MessageEmbed()
    .setColor(redlight)
    .setDescription(`❌ У вас недостаточно денег.`);

    let moneyhelp = new MessageEmbed()
    .setColor(redlight)
    .setDescription(`❌ Укажите ставку.`);

    let aembed = new MessageEmbed()
    .setColor(redlight)
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

    let timeout = 180000;

    let author = profileData.slots;
    if (author !== null && timeout - (Date.now() - author) > 0) {

      let time = new Date(timeout - (Date.now() - author));
      return message.channel.send(aembed.setDescription(`❌ Попробуй снова через **${time.getMinutes()} минут ${time.getSeconds()} секунд**.`)).then(msg => {msg.delete({timeout: "10000"})});
    } else {
      if (money < 100) return message.channel.send(aembed.setDescription(`❌ Минимальная ставка **100**.`)).then(msg => {msg.delete({timeout: "10000"})});
      if (!money) return message.channel.send(moneyhelp);
      if (money > 100000) return message.channel.send(aembed.setDescription(`❌ Максимальная ставка **100000**.`)).then(msg => {msg.delete({timeout: "10000"})});
      if (money > moneydb) return message.channel.send(moneymore);
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
          let slotsEmbed1 = new MessageEmbed()
              .setDescription(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\n✅ Ты выиграл ${money}${COIN}`)
              .setColor(greenlight)
              .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
          message.channel.send(slotsEmbed1)
          await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(money)}});


      } else {
          let slotsEmbed = new MessageEmbed()
              .setDescription(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\n❌ Ты проиграл ${money}${COIN}`)
              .setColor(redlight)
              .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
          message.channel.send(slotsEmbed)




      }
      await profileModel.findOneAndUpdate({userID: user.id},{$set: {slots: Date.now()}});

    }

}
}
