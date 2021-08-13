const respGlob = ['global', 'g', 'глобал', 'г'];
const respServ = ["server", 's', 'сервер', 'с'];
const {MessageEmbed} = require("discord.js");
const sd = require('../../models/serverSchema.js')
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const ms = require('ms');
const embed = require('../../embedConstructor');
const mc = require('discordjs-mongodb-currency');

module.exports = {
  config: {
    name: "купить",
    description: "Купить роли на сервере.",
    category: "c_economy",
    aliases: ['buy'],
    accessableby: "Для всех",
    usage: "[номер предмета]"
  },
  run: async (bot, message, args) => {
    const user = await mc.findUser(message.author.id, message.guild.id)
    const servData = await sd.findOne({serverID: message.guild.id})

    if (!args[0] || isNaN(args[0])) return embed(message).setError("Укажите номер предмета, который хотите купить.").send().then(msg => {msg.delete({timeout: "10000"})});
    if (args[0] > servData.shop.length) return embed(message).setError("Предмет не найден.").send().then(msg => {msg.delete({timeout: "10000"})});

    const resp = args[0] - 1
    const item = servData.shop[resp]
    if(isNaN(item.Cost) || item.Cost === null) return embed(message).setError("Предмет полностью не готов.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(!message.guild.roles.cache.get(item.Role)) return embed(message).setError("Предмет не имеет роль.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(item.Cost > user.coinsInWallet) return embed(message).setError("У вас недостаточно денег.").send().then(msg => {msg.delete({timeout: "10000"})});
    if(message.member.roles.cache.get(item.Role)) return embed(message).setError(`Вы уже имеете эту роль.`).send().then(msg => {msg.delete({timeout: "10000"})});
    try {
      let role = message.guild.roles.cache.get(item.Role);
      await message.member.roles.add(role)
    } catch (e) {
      return embed(message).setError(`Роль не найдена, либо слишком выше.`).send().then(msg => {msg.delete({timeout: "10000"})});
    }

    await mc.deductCoins(message.author.id, message.guild.id, item.Cost)
    return embed(message).setSuccess(`Вы успешно купили себе новую роль!`).send()
  }
}
