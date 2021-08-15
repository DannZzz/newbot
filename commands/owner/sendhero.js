const rpg = require("../../models/rpgSchema");
const {MessageEmbed} = require("discord.js");
const heroes = require('../../JSON/heroes.json');
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, AGREE } = require('../../config');
let ownerID = '382906068319076372';
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "sendhero",
    description: "",
    category: "",
    aliases: "",
    accessableby: "Для разработчика.",
    usage: "[ID] [название] "
  },
  run: async (bot, message, args) => {
    try {
    if (message.member.user.id !== ownerID) return 
    if (!args[0]) return embed(message).setError("Укажите участника.").send().then(msg => {msg.delete({timeout: "10000"})});

    let user = bot.users.cache.get(args[0]);
    let rp = await rpg.findOne({userID: user.id})
    if(!rp) {
      let newData = await rpg.create({
        userID: user.id
      });
      newData.save()
    }
    rp = await rpg.findOne({userID: user.id})

    if(!args[1]) return embed(message).setError("Укажите подарок.").send().then(msg => {msg.delete({timeout: "10000"})});
    const items = ["Zeenou", "Dilan", "Darius", "Selena", "Cthulhu", "Zeus", "PerfectDuo"];
    if (!items.includes(args[1])) return embed(message).setError("Герой не найден.").send().then(msg => {msg.delete({timeout: "10000"})});
    let giftType = heroes[args[01]]

    await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: giftType.name}})
    await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: giftType.health}})
    await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: giftType.damage}})
    await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: 1}})
    message.react(`${AGREE}`)
    return user.send(embed(message).setPrimary(`**У вас подарок от разработчика!🎉**\n\n||---**${giftType.nameRus}**---||`))


  } catch (e) {
    console.log(e);
  }
  }
}
