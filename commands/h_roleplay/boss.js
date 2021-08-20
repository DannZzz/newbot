const heroes = require('../../JSON/heroes.json');
const enemies = require('../../JSON/enemies.json');
const fights = require('../../JSON/fights.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, STAR } = require("../../config");
const { checkValue } = require("../../functions");
const mc = require('discordjs-mongodb-currency');
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 60000);

module.exports = {
  config: {
    name: "босс",
    aliases: ['boss'],
    category: 'h_roleplay',
    description: "Пойти в бой с боссом.",
    usage: "[упоминание | ID] двоих участников",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return error(message, 'Подождите одну минуту.')
       
    const bag = await bd.findOne({ userID: message.author.id });
    const profileData = await pd.findOne({ userID: message.author.id });

    let author = profileData.boss;
    let timeout;
    if (bag["vip2"] === true) { timeout = 43200 * 1000; } else {
      timeout = 86400 * 1000;
    }
    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = new Date(timeout - (Date.now() - author));

        return error(message, `Попробуй еще раз через **${time.getHours()} часа(ов) ${time.getMinutes()} минут.**.`);
    }
    if (!args[0]) return error(message, 'Укажите первого участника.');
    const user1 = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!user1) return error(message, 'Участник не найден.');
    if(user1.user.bot) return error(message, 'Укажите другого участника.');
    const mUser = message.author;
    if(user1.id === mUser.id) return error(message, 'Вы не можете начать бой с собой.');
    let count = 0;

    if(!args[1]) return error(message, 'Укажите второго участника.');
    const user2 = message.mentions.members.last() || message.guild.members.cache.get(args[1]);
    if(!user2) return error(message, 'Участник не найден.');
    if(user2.id === user1.id) return error(message, 'Этого участника вы уже указывали.')


    if(user2.id === mUser.id) return error(message, 'Вы не можете начать бой с собой.');

    const rp1 = await rpg.findOne({userID: user1.id});
    const rp2 = await rpg.findOne({userID: user2.id});

    const mrp = await rpg.findOne({userID: mUser.id});

    if (!mrp || mrp.item === null) return error(message, 'Вы не имеете героя.');
    if (!rp1 || rp1.item === null) return error(message, 'Первый участник не имеет героя.');
    if (!rp2 || rp2.item === null) return error(message, 'Второй участник не имеет героя.');

    let allHealth = rp1.health + rp2.health + mrp.health
    let allDamage = rp1.damage + rp2.damage + mrp.damage

    let boss = enemies["FireWalker"]

    let allLevel = (mrp.level + rp1.level + rp2.level) / 3

    if(allLevel <= 27) boss = enemies["EaterSkull"]

    let bossHealth = boss.health
    let bossDamage = boss.damage

    let winner;
    let loser;

    const item1 = rp1.item
    const item2 = rp2.item
    const mItem = mrp.item
    const data1 = heroes[mItem]
    const data2 = heroes[item1]
    const data3 = heroes[item2]

    let msg1;
    let msg2;
    let TIME = true;
    let fight = new MessageEmbed()
    .setTitle(`Поединок начался.`)
    .setImage(boss.url)
    .setThumbnail('https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif')
    .addField(`${mUser.username} [${mrp.level}] (${data1.nameRus})\n${user1.user.username} [${rp1.level}] (${data2.nameRus})\n${user2.user.username} [${rp2.level}] (${data3.nameRus})`, `** **`, true)
    .addField(`❤ Общая жизнь: ${allHealth}`, `**⚔ Общая атака: ${allDamage}**`, true)
    .addField(`\u200b`, `\u200b`, false)
    .addField(`${boss.name} (${boss.nameRus})`, `** **`, false)
    .addField(`❤ Общая жизнь: ${bossHealth}`, `**⚔ Общая атака: ${bossDamage}**`, false)
    .setColor(cyan)
    .setTimestamp()
    let trues = [false, false]
    let filter = m => m.author.id === user1.id;
    message.delete()
    let wait1 = await embed(message, `<@${user1.user.id}> вас приглашают в «Бой с Боссом», у вас 20 секунд.\nПринять: \`\`+\`\``, false)
    await message.channel.awaitMessages({
    filter,
    max: 1, // leave this the same
    time: 20000 // time in MS. there are 1000 MS in a second
  }).then(async (collected) => {
    if (collected.first().content === '+') {
      await wait1.delete()

      msg1 = await message.channel.send('Первый участник согласился.')
      trues[0] = true
    } else {
      return error(message, `Первый участник отказался.`);
    }
    console.log('collected :' + collected.first().content)
  }).catch(async() => {
    TIME = false
    wait1.delete()
    return message.channel.send('Время вышло, ваши друзья не успели принять приглашение.')
    });
    if(!TIME) return
    let wait2 = await embed(message, `<@${user2.user.id}> вас приглашают в «Бой с Боссом», у вас 20 секунд.\nПринять: \`\`+\`\``, false)
    filter = m => m.author.id === user2.id;
    await message.channel.awaitMessages({
    filter,
    max: 1, // leave this the same
    time: 20000 // time in MS. there are 1000 MS in a second
  }).then(async (collected) => {
    if (collected.first().content === '+') {
      await wait2.delete()

      msg2 = await message.channel.send('Второй участник согласился.')
      trues[1] = true
    } else {
      return error(message, `Второй участника отказался.`);
    }
    console.log('collected :' + collected.first().content)
  }).catch(async() => {
    wait2.delete()
    return message.channel.send('Время вышло, ваши друзья не успели принять приглашение.')
    });


    while (true) {
      if(trues[0] == true && trues[1] === true) {
        msg1.delete()
        msg2.delete()
        let newmsg = await message.channel.send({embeds: [fight]})
        setTimeout(async function() {
          let rand = Math.floor(Math.random() * 32)
          if (rand < 16) {
            while (true) {
              allHealth -= bossDamage
              bossHealth -= allDamage
              if(allHealth <= 0) {
                winner = false;
                break;
              } else if (bossHealth <= 0) {
                winner = true;
                break;
              }
            }
          } else {
            while (true) {
              bossHealth -= allDamage
              allHealth -= bossDamage
              if(bossHealth <= 0) {
                winner = true;
                break;
              } else if (allHealth <= 0) {
                winner = false;
                break;
              }
            }
          }

          let endEmbed = new MessageEmbed()
          .setColor(cyan)
          .setTimestamp()
          .setAuthor(`${boss.name} оказался сильнее.`)
          .setTitle(`${message.author.username}, ${user1.user.username} и ${user2.user.username} проиграли.`)
          .setThumbnail(boss.url)

          let winEmbed = new MessageEmbed()
          .setColor(cyan)
          .setTimestamp()
          .setAuthor(`${boss.name} сдался.`)
          .setTitle(`${message.author.username}, ${user1.user.username} и ${user2.user.username} выиграли.`)
          .setDescription(`Каждый получает по ${boss.reward} ${STAR}`)
          .setThumbnail(boss.url)

          if (winner){
            await bd.findOneAndUpdate({userID: mUser.id}, {$inc: {stars: boss.reward}})
            await bd.findOneAndUpdate({userID: user1.id}, {$inc: {stars: boss.reward}})
            await bd.findOneAndUpdate({userID: user2.id}, {$inc: {stars: boss.reward}})

            await pd.findOneAndUpdate({userID: mUser.id}, {$set: {boss: Date.now()}})
            await pd.findOneAndUpdate({userID: user1.id}, {$set: {boss: Date.now()}})
            await pd.findOneAndUpdate({userID: user2.id}, {$set: {boss: Date.now()}})

            return newmsg.edit({embeds: [winEmbed]})
          } else {
            return newmsg.edit({embeds: [endEmbed]})
          }

        }, 20000)
        break;
      } else {
        continue;
      }
    }

  }
};
