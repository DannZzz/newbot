const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const embed = require('../../embedConstructor');
const profileModel = require("../../models/profileSchema")
const begModel = require("../../models/begSchema")
const {COIN, BANK} = require('../../config');


module.exports = {
  config: {
        name: "рулетка",
        description: "Играть в рулетку.",
        category: "c_economy",
        aliases: ['roulette', 'рул'],
        accessableby: "Для всех",
        usage: "[ставка] [промежуток]"
  },
  run: async (bot, message, args) => {
  const types = ['1-12', '13-24', '25-32'];
  const colors = ['red', 'black', 'красный', 'черный', 'чёрный'];
  const numberss = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]
  const numbers = numberss.map(rep => rep + '')
  let data = await profileModel.findOne({userID: message.author.id  })
  let beg = await begModel.findOne({ userID: message.author.id });
  var value = args[0]
  let author = data.roulette;
  let timeout;
  if (beg["vip2"] === true) { timeout = 31 * 1000; } else {
    timeout = 60 * 1000;
  }

  if (author !== null && timeout - (Date.now() - author) > 0) {
      let time = new Date(timeout - (Date.now() - author));

      return embed(message).setError(`Попробуй еще раз через **${time.getSeconds()} секунд.**.`).send().then(msg => {msg.delete({timeout: "10000"})});
  }


if (value === 'help' || value === 'хелп') {
    return embed(message)
          .setPrimary(`**\`\`?рулетка <ставка> [промежуток]\`\`**\n\nВсе доступные промежутки.\n\`\`\`Цвета: красный, черный\nГруппы: 1-12, 13-24, 25-32\nПрямые ставки: 0, 1, 2 ... 32\`\`\``)
          .send()
  }


  if (!Math.floor(parseInt(value))) {return embed(message)
        .setError('Вы неверно указали сумму.')
        .send().then(msg => {
          msg.delete({
            timeout: "10000"
          })
        })
      }

  if (value < 100) return embed(message).setError(`Минимальная ставка **100**.`).send().then(msg => {msg.delete({timeout: "10000"})});

  if (!beg["vip1"] && value > 100000) {
    return embed(message).setError("Максимальная ставка **100.000**!\nЛибо купите VIP").send().then(msg => {
      msg.delete({
        timeout: "10000"
      })
    })
  } else if (!beg["vip2"] && value > 1000000) {
    return embed(message).setError("Максимальная ставка **1.000.000**!\nЛибо купите VIP 2").send().then(msg => {
      msg.delete({
        timeout: "10000"
      })
    })
  }

  var type = args[1]

  if (data.coins < value) return embed(message)
      .setError('У вас недостаточно монет.')
      .send()
      .then(msg => {
        msg.delete({
          timeout: "10000"
        })
      })

  if (!types.includes(type) && !colors.includes(type) && !numbers.includes(type)) return embed(message)
      .setError(`Вы неверно указали промежутки.\n\`\`?рулетка хелп\`\``)
      .send()
      .then(msg => {
        msg.delete({
          timeout: "10000"
        })
      })

  await profileModel.findOneAndUpdate({ userID: message.author.id }, {
      $inc: { coins: -value }
    })
    await embed(message)
        .setSuccess('Вы участвуете в рулетке.')
        .send()

  await profileModel.findOneAndUpdate({userID: message.author.id}, {$set: {roulette: Date.now()}})

  let randNum = Math.floor(Math.random() * 32)
  let final;
  let finalColor;
  if (randNum >= 1 && randNum <= 12) final = types[0]
  if (randNum >= 13 && randNum <= 24) final = types[1]
  if (randNum >= 25 && randNum <= 32) final = types[2]
  if (randNum <= 16) {finalColor = 'Красный'}
  else if (randNum <= 32) {
    finalColor = 'Чёрный'
  }

  let finalType;
  let winType;
  if(types.includes(type)) {
    finalType = type;
    winType = 1;
  } else if (colors.includes(type)) {
    if(type === 'red' || type === 'красный') {
      finalType = 'Красный';
    } else if (type === 'black' || type === 'черный' || type === 'чёрный') {
      finalType = 'Чёрный';
    }
    winType = 2;
  } else if (numbers.includes(type)) {
    finalType = type;
    winType = 3;
  }
  setTimeout(async function() {
    if (winType === 1) {
      if (finalType === final) {
        await profileModel.findOneAndUpdate({userID: message.author.id}, {$inc: {coins: value * 3}})

        return embed(message).setSuccess(`Выпало: **${finalColor} ${randNum}**\n\nВы выиграли **${value * 3}** ${COIN}`).send()
      }
    } else if (winType === 2) {
      if (finalType === finalColor) {
        await profileModel.findOneAndUpdate({userID: message.author.id}, {$inc: {coins: value * 2}})

        return embed(message).setSuccess(`Выпало: **${finalColor} ${randNum}**\n\nВы выиграли **${value * 2}** ${COIN}`).send()
      }
    } else if (winType === 3) {
      if (finalType === randNum) {
        await profileModel.findOneAndUpdate({userID: message.author.id}, {$inc: {coins: value * 16}})

        return embed(message).setSuccess(`Выпало: **${finalColor} ${randNum}**\n\nВы выиграли **${value * 16}** ${COIN}`).send()
      }
    }
    return embed(message).setError(`Выпало: **${finalColor} ${randNum}**\n\nВы проиграли.`).send()


  }, 30 * 1000)

  }
}
