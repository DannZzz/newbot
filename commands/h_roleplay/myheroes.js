const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageButton } = require("discord.js");
const {error, pagination} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "мои",
    aliases: ['my'],
    category: 'h_roleplay',
    description: "Информация о своих героев.",
    usage: "",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if (limited) return
    const rp = await rpg.findOne({userID: message.author.id});
    if (!rp) return error(message, 'Вы не имеете героев.')

    if (!rp.heroes || rp.heroes.length === 0 || rp.item !== rp.heroes[0]["name"]) {
        await rp.heroes.push({
                name: rp.item,
                level: rp.level,
                health: rp.health,
                damage: rp.damage
            })
        rp.save()
    }

    const item = rp.heroes[0]
    const h = heroes[item.name];
    const hero = new MessageEmbed()
    .setThumbnail(h.url)
    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
    .setTitle(`${h.name} (${h.nameRus})`)
    .setDescription(h.description)
    .setColor(cyan)
    .addField(`💯 Уровень: ${item.level}\n❤ Общая жизнь: ${item.health}\n⚔ Общая атака: ${item.damage}`, `** **`)
    .setFooter(`1 / 1`)

    if (rp.heroes.length === 1) {
        return message.channel.send({embeds: [hero]})
    } else {

    

    const item1 = rp.heroes[0]
    const h1 = heroes[item1.name];
    const hero1 = new MessageEmbed()
    .setThumbnail(h1.url)
    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
    .setTitle(`${h1.name} (${h1.nameRus})`)
    .setDescription(h1.description)
    .setColor(cyan)
    .addField(`💯 Уровень: ${item1.level}\n❤ Общая жизнь: ${item1.health}\n⚔ Общая атака: ${item1.damage}`, `** **`)
    
    const item2 = rp.heroes[1]
    const h2 = heroes[item2.name];
    const hero2 = new MessageEmbed()
    .setThumbnail(h2.url)
    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
    .setTitle(`${h2.name} (${h2.nameRus})`)
    .setDescription(h2.description)
    .setColor(cyan)
    .addField(`💯 Уровень: ${item2.level}\n❤ Общая жизнь: ${item2.health}\n⚔ Общая атака: ${item2.damage}`, `** **`)

    const button1 = new MessageButton()
                .setCustomId('previousbtn')
                .setLabel('Предыдущая')
                .setStyle('DANGER');

                const button2 = new MessageButton()
                .setCustomId('nextbtn')
                .setLabel('Следующая')
                .setStyle('SUCCESS');

          let buttonList = [
              button1,
              button2
          ]

          const userids = [message.author.id]

          pagination(message, [hero1, hero2], buttonList, 100000, userids)
    }   
  }
}