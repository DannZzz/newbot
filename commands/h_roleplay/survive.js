const heroes = require('../../JSON/heroes.json');
const enemies = require('../../JSON/enemies.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, STAR } = require("../../config");
const { checkValue } = require("../../functions");
const embed = require('../../embedConstructor');

module.exports = {
  config: {
    name: "приключения",
    aliases: ['journey', 'аdventures'],
    category: 'h_roleplay',
    description: "Посмотреть статистику своего героя.",
    usage: "(инфо | info)",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    const data = await bd.findOne({userID: message.author.id})
    const user = message.author;
    const bag = await bd.findOne({userID: user.id})
    let rp = await rpg.findOne({userID: user.id});
    if(!rp || rp.item === null) {
      return embed(message).setError(`Сначала купите героя...\`\`?приобрести\`\``).send()
    }
    if (!rp.surviveLevel || rp.surviveLevel === null) await rpg.findOneAndUpdate({userID: user.id}, {$set: {surviveLevel: 1}});
    rp = await rpg.findOne({userID: user.id});
    const nowLevel = rp.surviveLevel;
    const levelRewardAdd = 10;
    const levelReward = levelRewardAdd * nowLevel
    const argsWords = ['info', 'инфо']

    const hero = heroes[rp.item];
    let enemy;
    if (nowLevel % 4 === 0) {
      enemy = enemies["Cousin"];
    } else {
      enemy = enemies["Jorj"];
    }

    const getTime = await pd.findOne({userID: user.id})
    const author = getTime.survive || 0;

  let timeoutt;
    if (bag["vip2"] === true) { timeoutt = 1800000; } else {
      timeoutt = 3559000;
    }
    if (author !== null && timeoutt - (Date.now() - author) > 0) {
        let time = new Date(timeoutt - (Date.now() - author));

        return embed(message).setError(`Вы недавно вернулись из приключений. Отдыхай **${time.getMinutes()} минут ${time.getSeconds()} секунд.**.`).send().then(msg => {msg.delete({timeout: "10000"})});
    }

    let enemyHealth = nowLevel >= 3 ? Math.floor(enemy.health * (nowLevel / 2)) : Math.floor(enemy.health * nowLevel);
    let enemyDamage = nowLevel >= 3 ? Math.floor(enemy.damage * (nowLevel / 2)) : Math.floor(enemy.damage * nowLevel);

    let myHealth = rp.health;
    let myDamage = rp.damage;
    let win;

    const lonely = new MessageEmbed()
    .setColor(cyan)
    .setTimestamp()
    .setTitle(`Бой начался.`)
    .addField(`${user.username}`, `(${hero.nameRus})`, true)
    .addField(`❤ Общая жизнь: ${myHealth}`, `**⚔ Общая атака: ${myDamage}**`, true)
    .addField(`\u200b`, `\u200b`, false)
    .addField(`${enemy.name}`, `(${enemy.nameRus})`, true)
    .addField(`❤ Общая жизнь: ${enemyHealth}`, `**⚔ Общая атака: ${enemyDamage}**`, true)
    .setThumbnail(`https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif`)
    .setImage("https://i.ibb.co/wrsPgsQ/killin.gif")

    if (args[0] && argsWords.includes(args[0])) {
      const levMes = new MessageEmbed()
      .setColor(cyan)
      .setAuthor(`${user.username}, ваш текущий уровень приключений: ${nowLevel}`)
      .setTitle(`Враг — ${enemy.name} (${enemy.nameRus})`)
      .setDescription(enemy.description)
      .addField(`❤ Общая жизнь: ${enemyHealth}`, `**⚔ Общая атака: ${enemyDamage}**`, false)
      .addField(`Награда: ${levelReward} ${STAR}`, `** **`, false)
      .setImage(enemy.url)

      return message.channel.send(levMes);
    } else {
      let rand = Math.floor(Math.random() * 32)
      if (rand < 16) {
        while (true) {
          myHealth -= enemyDamage;
          enemyHealth -= myDamage;
          if(myHealth <= 0) {
            win = false;
            break;
          } else if (enemyHealth <= 0) {
            win = true;
            break;
          }
        }
      } else {
        while (true) {
          enemyHealth -= myDamage;
          myHealth -= enemyDamage;
          if(enemyHealth <= 0) {
            win = true;
            break;
          } else if (myHealth <= 0) {
            win = false;
            break;
          }
        }
      }
    }
    
    await pd.findOneAndUpdate({userID: user.id}, {$set: {survive: Date.now()}})
    let winner;
    win ? winner = hero : winner = enemy

    let msgozv = new MessageEmbed()
    .setColor(cyan)
    .setTitle("Сценарий.")
    .setDescription(`**${enemy.nameRus}:** Эй! **${user.username}**, мой лорд ждёт тебя.`)
    let emb = new MessageEmbed()
    .setColor(cyan)
    .setTimestamp()
    if(winner === hero){
      emb
      .setTitle(`Вы оказались сильнее.`)
      .setDescription(`Награда за уровень: ${levelReward} ${STAR}`)
      .setThumbnail(enemy.url)
      .setImage(hero.url)

      await bd.findOneAndUpdate({userID: user.id}, {$inc: {stars: levelReward}});
      await rpg.findOneAndUpdate({userID: user.id}, {$inc: {surviveLevel: 1}});

    } else {
      emb
      .setTitle(`${enemy.nameRus} отказался сильнее.`)
      .setDescription(`Вернитесь через некоторое время.`)
      .setThumbnail(hero.url)
      .setImage(enemy.url)


    }
    let msg = await message.channel.send(lonely);
    setTimeout(function(){
      return msg.edit(emb)
    }, 15000)
    // message.channel.send(msgozv).then(
    //   (msg) => {
    //     setTimeout(function(){
    //       msg.edit(msgozv.setDescription(`**${user.username}:** Мерзкая тварь, твой лорд ещё заплатит за всё!`)).then(
    //         (msgg) => {
    //           setTimeout(function(){
    //             msgg.edit(msgozv.setDescription(`**${enemy.nameRus}:** Твои последние слова...?`)).then(
    //               (ccc) => {
    //                 setTimeout(function(){
    //                   ccc.edit(lonely)
    //                 }, 8000)
    //               }
    //             )
    //           }, 8000)
    //         }
    //       )
    //     }, 8000)
    //
    // }
    // )

  }
};
