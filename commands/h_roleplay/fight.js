const heroes = require('../../JSON/heroes.json');
const fights = require('../../JSON/fights.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN } = require("../../config");
const { checkValue } = require("../../functions");
const mc = require('discordjs-mongodb-currency');
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "бой",
    aliases: ['fight'],
    category: 'h_roleplay',
    description: "Пойти в поединок с участником.",
    usage: "[тег | никнейм | упоминание | ID] <ставка>",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    const bag = await bd.findOne({ userID: message.author.id });
    const profileData = await pd.findOne({ userID: message.author.id });

    let author = profileData.rpg;
    let timeout;
    if (bag["vip2"] === true) { timeout = 70 * 1000; } else {
      timeout = 140 * 1000;
    }
    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = new Date(timeout - (Date.now() - author));

        return error(message, `Попробуй еще раз через **${time.getMinutes()} минут ${time.getSeconds()} секунд.**.`);
    }
    if (!args[0]) return error(message, 'Укажите участника.');
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    if(!user) return error(message, 'Участник не найден.');
    if(user.user.bot) return error(message, 'Поединок с ботом...хм');
    const mUser = message.author;
    if(user.id === mUser.id) return error(message, 'Вы не можете начать бой с собой.');

    if(!args[1] || isNaN(args[1])) return error(message, 'Укажите ставку.');
    let value = Math.floor(args[1])
    let data11 = await mc.findUser(user.id, message.guild.id)
    let data22 = await mc.findUser(mUser.id, message.guild.id)

    let bal = data11.coinsInWallet
    let mBal = data22.coinsInWallet
    if (value < 10000) return error(message, `Минимальная ставка **10000**.`);

    if (!bag["vip1"] && value > 100000) {
      return error(message, "Максимальная ставка **100.000**!\nЛибо купите VIP");
    } else if (!bag["vip2"] && value > 1000000) {
      return error(message, "Максимальная ставка **1.000.000**!\nЛибо купите VIP 2");
    }

    if(value > mBal) return error(message, `У вас недостаточно денег.`);
    if(value > bal) return error(message, `${user} не имеет столько денег.`);

    const rp = await rpg.findOne({userID: user.id});
    const mrp = await rpg.findOne({userID: mUser.id});

    if (!mrp || mrp.item === null) return error(message, 'Вы не имеете героя.');
    if (!rp || rp.item === null) return error(message, 'Участник не имеет героя.');

    let h1 = rp.health
    let h2 = mrp.health
    let d1 = rp.damage
    let d2 = mrp.damage
    let winner;
    let loser;

    const item = rp.item
    const mItem = mrp.item

    let gifUrl;
    fights.filter(function (arr) {
      if((item === mItem && arr[0][0] === mItem && arr[0][1] === mItem) || (arr[0][0] === item && arr[0][1] === mItem) || (arr[0][1] === item && arr[0][0] === mItem)) gifUrl = arr[1]

    })
    await mc.deductCoins(user.id, message.guild.id, value)
    await mc.deductCoins(mUser.id, message.guild.id, value)

    const data1 = heroes[mItem];
    const data2 = heroes[item];

    let myHero = new MessageEmbed()
    .setTitle(`Поединок начался.`)
    .setImage(gifUrl)
    .setThumbnail('https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif')
    .addField(`${mUser.username} (${data1.nameRus})`, `**Уровень: ${mrp.level}**`, true)
    .addField(`❤ Общая жизнь: ${mrp.health}`, `**⚔ Общая атака: ${mrp.damage}**`, true)
    .addField(`\u200b`, `\u200b`, false)
    .addField(`${user.user.username} (${data2.nameRus})`, `**Уровень: ${rp.level}**`, true)
    .addField(`❤ Общая жизнь: ${rp.health}`, `**⚔ Общая атака: ${rp.damage}**`, true)
    .setColor(cyan)

    const filter = m => m.author.id === user.id || m.author.id === user.id;
    message.delete()
    let wait = await embed(message, `<@${user.user.id}> у вас 20 секунд, чтобы принять вызов.\nСтавка: __${value}__ ${COIN}\n\nПринять: \`\`+\`\`\nОтклонить: \`\`-\`\``, false)
    await message.channel.awaitMessages({
    filter, 
    max: 1, // leave this the same
    time: 20000,
    errors: ['time'] // time in MS. there are 1000 MS in a second
  }).then(async (collected) => {
        if(collected.first().content == '-'){
          await wait.delete()
          await mc.giveCoins(user.id, message.guild.id, value)
          await mc.giveCoins(mUser.id, message.guild.id, value)
          return error(message, `${user} отказался.`)
    }
    else if (collected.first().content == '+') {
      await wait.delete()
      await pd.findOneAndUpdate({userID: message.author.id}, {$set: {rpg: Date.now()}})
      let msg = await message.channel.send({embeds: [myHero]});
      let rand = Math.floor(Math.random() * 32)
      if (rand < 16) {
        while (true) {
          h1 -= d2
          h2 -= d1
          if(h1 <= 0) {
            winner = message.author;
            loser = user;
            break;
          } else if (h2 <= 0) {
            winner = user;
            loser = message.author;
            break;
          }
        }
      } else {
        while (true) {
          h2 -= d1
          h1 -= d2
          if(h2 <= 0) {
            winner = user;
            loser = message.author;
            break;
          } else if (h1 <= 0) {
            winner = message.author;
            loser = user;
            break;
          }
        }
      }


      await rpg.findOneAndUpdate({userID: winner.id}, {$inc: {totalGames: 1}})
      await rpg.findOneAndUpdate({userID: loser.id}, {$inc: {totalGames: 1}})


      setTimeout(async() => {
        await mc.giveCoins(winner.id, message.guild.id, 2 * value)

        await rpg.findOneAndUpdate({userID: winner.id}, {$inc: {wins: 1}})
        await rpg.findOneAndUpdate({userID: loser.id}, {$inc: {loses: 1}})

        let winData = await rpg.findOne({userID: winner.id})

        let hero = heroes[winData.item]
        let winEmb = new MessageEmbed()
        .setTitle(`Победитель: ${winner.tag || winner.user.tag} (${hero.nameRus})`)
        .setDescription(`Поединок между: ${user}, ${mUser}`)
        .setImage(hero.url)
        .setColor(cyan)
        .addField(`❤ Общая жизнь: ${winData.health}`, `**⚔ Общая атака: ${winData.damage}**`, true)
        .addField(`Выигрыш: ${value * 2} ${COIN}`, `**🏆 Процент побед: ${Math.trunc(winData.wins / winData.totalGames * 100) || '0'}%**`, true)

        return msg.edit({embeds: [winEmb]})
      }, 25000)

    } else {
      await mc.giveCoins(user.id, message.guild.id, value)
      await mc.giveCoins(mUser.id, message.guild.id, value)
      return error(message, `Поединок отклонен.`);
    }
    console.log('collected :' + collected.first().content)
  }).catch(async() => {
        // what to do if a user takes too long goes here
    await mc.giveCoins(user.id, message.guild.id, value)
    await mc.giveCoins(mUser.id, message.guild.id, value)
    message.reply('Время прошло, ваш соперник не успел принять вызов.')
    });



  }
};
