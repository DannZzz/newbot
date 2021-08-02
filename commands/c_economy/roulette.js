const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const embed = require('../../embedConstructor');
const profileModel = require("../../models/profileSchema")
const begModel = require("../../models/begSchema")
let Roulette = require('../../constructors/Roulette')

const { addUser, game } = Roulette

module.exports = {
  config: {
        name: "рулетка",
        description: "Играть в рулетку.",
        category: "c_economy",
        aliases: ['roulette', 'рул'],
        accessableby: "Для всех",
        usage: "[ставка] [1-12, 13-24, 25-32]"
  },
  run: async (bot, message, args) => {
  const types = ['1-12', '13-24', '25-32']
  let data = await profileModel.findOne({userID: message.author.id  })
  let beg = await begModel.findOne({ userID: message.author.id });
  var value = Math.floor(parseInt(args[0]))
  let author = data.roulette;
  let timeout;
  if (beg["vip2"] === true) { timeout = 31 * 1000; } else {
    timeout = 60 * 1000;
  }

  if (author !== null && timeout - (Date.now() - author) > 0) {
      let time = new Date(timeout - (Date.now() - author));

      return embed(message).setError(`Попробуй еще раз через **${time.getSeconds()} секунд.**.`).send().then(msg => {msg.delete({timeout: "10000"})});
  }

  if (!value) return embed(message)
        .setError('Вы неверно указали сумму.')
        .send()

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

  if (!types.includes(type)) return embed(message)
      .setError(`Вы неверно указали промежутки. Доступные промежутки ${types.join()}.`)
      .send()

  await profileModel.findOneAndUpdate({ userID: message.author.id }, {
      $inc: { coins: -value }
    })

  addUser(message.author.id, type, value, message.channel)

    embed(message)
        .setSuccess('Вы участвуете в рулетке.')
        .send()

  await profileModel.findOneAndUpdate({userID: message.author.id}, {$set: {roulette: Date.now()}})
  }
}
