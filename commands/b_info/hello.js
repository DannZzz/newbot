const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "xz",
    aliases: '',
    category: "c_economy",
    description: "Дает 200 монет ежедневно.",
    usage: " ",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    embed(message).setError('asdasda').send()
  }
}
