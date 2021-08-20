//const slotItems = ["🍇", "🍉", "🍌", "🍎", "🍒"];
const slotItems = ["<a:163:849994358828171296>", "<a:164:849994326025043988>", "<a:170:849994324577878037>", "<a:166:849994325831712798>", "<a:168:849994325441773588>"];
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, BANK, AGREE, DISAGREE } = require('../../config');
const memberModel = require("../../models/memberSchema");
const begModel = require("../../models/begSchema");
const mc = require('discordjs-mongodb-currency');
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
    config: {
        name:"слот",
        aliases: ["sl", "slots", "slot", "сл"],
        category: "c_economy",
        description: "Игра слоты!",
        usage: "[ставка]",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    let user = message.author;
    let memberData = await memberModel.findOne({ userID: user.id, serverID: message.guild.id });
    let beg = await begModel.findOne({ userID: user.id });
    let data = await mc.findUser(user.id, message.guild.id)
    let moneydb = data.coinsInWallet;
    let money = Math.floor(parseInt(args[0]));
    let win = false;


    let aembed = new MessageEmbed()
    .setColor(redlight)
    .setTimestamp()
    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

    let timeout;
    if (beg["vip2"] === true) { timeout = 90 * 1000; } else {
      timeout = 180 * 1000;
    };

    let author = memberData.slots;
    if (author !== null && timeout - (Date.now() - author) > 0) {

      let time = new Date(timeout - (Date.now() - author));
      return error(message, `Попробуй снова через **${time.getMinutes()} минут ${time.getSeconds()} секунд**.`);
    } else {
      if (money < 100) return error(message, `Минимальная ставка **100**.`);
      if (!money) return error(message, 'Укажите ставку.')

      if (!beg["vip1"] && money > 100000) {
        return error(message, "Максимальная ставка **100.000**!\nЛибо купите VIP");
      } else if (!beg["vip2"] && money > 1000000) {
        return error(message, "Максимальная ставка **1.000.000**!\nЛибо купите VIP 2");
      }


      if (money > moneydb) return error(message, `У вас недостаточно денег.`)
      await memberModel.findOneAndUpdate({userID: user.id, serverID: message.guild.id},{$set: {slots: Date.now()}});
      let reward = 0 ;
      let number = []
      await mc.deductCoins(user.id, message.guild.id, Math.floor(money))

      for (let i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }

      if (number[0] == number[1] && number[1] == number[2])  {
          money = money * 3;
          win = true;
      } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
          money = money * 2;
          win = true;
      }
      if (win) {

          embed(message, `${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\n${AGREE} Ты выиграл ${money}${COIN}`, false);
          await mc.giveCoins(user.id, message.guild.id, Math.floor(money))
      } else {
          embed(message, `${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\n${DISAGREE} Ты проиграл ${money}${COIN}`, false);

      }


    }

}
}
