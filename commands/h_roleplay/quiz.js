const quiz = require('../../JSON/quiz.json');
const { cyan } = require('../../JSON/colours.json');
const bd = require("../../models/begSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, STAR, AGREE, DISAGREE } = require("../../config");
const { shuffle } = require("../../functions");
const embed = require('../../embedConstructor');
const respA = ['A', 'а', "1"]
const respB = ['B', 'b', "2"]
const respC = ['C', 'c', "3"]
const respD = ['D', 'd', "4"]
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);


module.exports = {
  config: {
    name: "викторина",
    aliases: ['quiz'],
    category: 'h_roleplay',
    description: "Отвечать на вопросы и получать награды.",
    usage: "",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    let random = Math.floor(Math.random() * quiz.length)
    let newQuizArray = shuffle(quiz)
    let getOneQuestion = newQuizArray[random]
    let randForResp = Math.ceil(Math.random() * 4)
    let getQuestion = getOneQuestion.q;
    let getAnswer = getOneQuestion.a;
    let getResponses = getOneQuestion.r
    let shuffledRes = shuffle(getResponses)
    let a = shuffledRes[0]
    let b = shuffledRes[1]
    let c = shuffledRes[2]
    let d = shuffledRes[3]
    let userResponse;

    const filter = m => m.author.id === message.author.id;
    let Emb = new MessageEmbed()
    .setColor(cyan)
    .setTimestamp()
    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
    let msg = await embed(message).setPrimary(`
У вас 15 секунд.
Вопрос:
\`\`${getQuestion}\`\`

:regional_indicator_a: | ${a}
:regional_indicator_b: | ${b}
:regional_indicator_c: | ${c}
:regional_indicator_d: | ${d}
   `).send()
    await message.channel.awaitMessages(filter, {
    max: 1, // leave this the same
    time: 15000,
    errors: ['time'] // time in MS. there are 1000 MS in a second
  }).then(async (collected) => {
    if (respA.includes(collected.first().content)) {
      userResponse = a
      if (userResponse === getAnswer) {
        await bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: 1}})
        return msg.edit(Emb.setDescription(`${AGREE} Вы ответили правильно, ваша награда — **1** ${STAR}.`))

      } else {
        return msg.edit(Emb.setDescription(`${DISAGREE} Вы ответили неправильно.`))
      }
    } else if (respB.includes(collected.first().content)) {
      userResponse = b
      if (userResponse === getAnswer) {
        await bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: 1}})
        return msg.edit(Emb.setDescription(`${AGREE} Вы ответили правильно, ваша награда — **1** ${STAR}.`))

      } else {
        return msg.edit(Emb.setDescription(`${DISAGREE} Вы ответили неправильно.`))
      }
    } else if (respC.includes(collected.first().content)) {
      userResponse = c
      if (userResponse === getAnswer) {
        await bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: 1}})
        return msg.edit(Emb.setDescription(`${AGREE} Вы ответили правильно, ваша награда — **1** ${STAR}.`))

      } else {
        return msg.edit(Emb.setDescription(`${DISAGREE} Вы ответили неправильно.`))
      }
        } else if (respD.includes(collected.first().content)) {
      userResponse = d
      if (userResponse === getAnswer) {
        await bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: 1}})
        return msg.edit(Emb.setDescription(`${AGREE} Вы ответили правильно, ваша награда — **1** ${STAR}.`))

      } else {
        return msg.edit(Emb.setDescription(`${DISAGREE} Вы ответили неправильно.`))
      }
    } else {
      return msg.edit(Emb.setDescription(`${DISAGREE} Вы ответили неправильно.`));
    }
    console.log('collected :' + collected.first().content)
  }).catch(async() => {

    return msg.edit(Emb.setDescription(`${DISAGREE} Время вышло, попробуйте снова.`));
    });

  }
};
