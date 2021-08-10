const {
  stripIndents
} = require('common-tags');
const {
  shuffle,
  verify
} = require('../../functions');
const suits = ['<:kyap:864965175941791786>', '<:xach:864965176088068096>', '<:xar:864965175764320277>', '<:sirt:864965176330682408>'];
const faces = ['Валет', 'Дама', 'Король'];
const hitWords = ['повысить', 'hit'];
const standWords = ['оставить', 'stand'];
const {
  MessageEmbed
} = require("discord.js");
const {
  greenlight,
  redlight,
  cyan
} = require('../../JSON/colours.json');
const {
  COIN,
  BANK
} = require('../../config');
const profileModel = require("../../models/profileSchema");
const begModel = require("../../models/begSchema");
const embed = require('../../embedConstructor');
const mc = require('discordjs-mongodb-currency');


module.exports = {
  config: {
    name: 'блэкджек',
    aliases: ['bj', 'blackjack', 'бж'],
    category: 'c_economy',
    usage: '[число колод 1-8] <ставка>',
    description: 'Игра Блэкджек!',
    accessableby: 'Для всех'
  },
  run: async (bot, message, args, ops) => {

    if (!args[0]) return embed(message).setError("Укажите кол-во колод!").send().then(msg => {
      msg.delete({
        timeout: "10000"
      })
    });
    let deckCount = parseInt(args[0])
    if (isNaN(args[0])) return embed(message).setError("Укажите число!").send().then(msg => {
      msg.delete({
        timeout: "10000"
      })
    });
    if (deckCount <= 0 || deckCount >= 9) return embed(message).setError("Укажите число колод , от 1 до 8!").send().then(msg => {
      msg.delete({
        timeout: "10000"
      })
    });

    let user = message.author;
    let profileData = await mc.findUser(message.member.id, message.guild.id)
    let bal = profileData.coinsInWallet;

    if (!args[1]) return embed(message).setError("Укажите ставку!").send().then(msg => {
      msg.delete({
        timeout: "10000"
      })
    })

    let amount = parseInt(args[1])
    if (isNaN(args[1])) return embed(message).setError("Укажите число!").send().then(msg => {
      msg.delete({
        timeout: "10000"
      })
    })
    if (Math.floor(amount) < 100) return embed(message).setError("Минимальная ставка **100**!").send().then(msg => {
      msg.delete({
        timeout: "10000"
      })
    })
    let bag = await begModel.findOne({userID: message.author.id})
    if (!bag["vip1"] && Math.floor(amount) > 100000) {
      return embed(message).setError("Максимальная ставка **100.000**!\nЛибо купите VIP").send().then(msg => {
        msg.delete({
          timeout: "10000"
        })
      })
    } else if (!bag["vip2"] && Math.floor(amount) > 1000000) {
      return embed(message).setError("Максимальная ставка **1.000.000**!\nЛибо купите VIP 2").send().then(msg => {
        msg.delete({
          timeout: "10000"
        })
      })
    }

    if (bal < Math.floor(amount)) return embed(message).setError("У вас недостаточно денег!").send().then(msg => {
      msg.delete({
        timeout: "10000"
      })
    })
    const current = ops.games.get(message.channel.id);
    if (current) return embed(message).setError(`Пожалуйста подождите пока игра **${current.name}** закончится!`).send().then(msg => {
      msg.delete({
        timeout: "10000"
      })
    })
    try {
      await mc.deductCoins(message.member.id, message.guild.id, Math.floor(amount))
      ops.games.set(message.channel.id, {
        name: 'blackjack',
        data: generateDeck(deckCount)
      });
      const dealerHand = [];
      draw(message.channel, dealerHand);
      draw(message.channel, dealerHand);
      const playerHand = [];
      draw(message.channel, playerHand);
      draw(message.channel, playerHand);
      const dealerInitialTotal = calculate(dealerHand);
      const playerInitialTotal = calculate(playerHand);

      if (dealerInitialTotal === 21 && playerInitialTotal === 21) {
        ops.games.delete(message.channel.id);
        await profileModel.findOneAndUpdate({
          userID: user.id
        }, {
          $inc: {
            coins: Math.floor(amount)
          }
        });
        return embed(message).setPrimary("😂 У вас обоих Блэкджек!").send()
      } else if (dealerInitialTotal === 21) {
        ops.games.delete(message.channel.id);

        return embed(message).setError(`У дилера блэкджек!\nВы проиграли **${Math.floor(Math.floor(amount))}**${COIN}`).send()
      } else if (playerInitialTotal === 21) {
        ops.games.delete(message.channel.id);

        await mc.giveCoins(message.member.id, message.guild.id, Math.floor((2 * Math.floor(amount)) + (Math.floor(amount) / 2)));
        return embed(message).setSuccess(`У вас блэкджек!\nВы выиграли **${Math.floor((2 * Math.floor(amount)) + (Math.floor(amount) / 2))}**${COIN}`).send()
      }

      let playerTurn = true;
      let win = false;
      let reason;
      let gameEmbed = new MessageEmbed()
        .setColor(cyan)
        .setTimestamp()
        .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({
          dynamic: true
        }))

      while (!win) {
        if (playerTurn) {
          let msg = await embed(message).setPrimary(`
						**Первая карта дилера -** ${dealerHand[0].display}\n\n
						**Вы [${calculate(playerHand)}] -**\n
						**${playerHand.map(card => card.display).join('\n')}**\n\n
                        \`[Повысить / Оставить]\`\n\n
					`).send();
          const hit = await verify(message.channel, message.author, {
            extraYes: hitWords,
            extraNo: standWords
          });
          if (hit) {
            const card = draw(message.channel, playerHand);
            const total = calculate(playerHand);
            if (total > 21) {
              reason = `Вы достаете ${card.display}, Общее ${total}! Увы`;
              break;
            } else if (total === 21) {
              reason = `Вы достаете ${card.display} И добиваете 21!`;
              win = true;
            }
          } else {
            const dealerTotal = calculate(dealerHand);
            await embed(message).setPrimary(`**Вторая карта дилера ${dealerHand[1].display}, в общем ${dealerTotal}!**`).send();
            playerTurn = false;
          }
        } else {
          const inital = calculate(dealerHand);
          let card;
          if (inital < 17) card = draw(message.channel, dealerHand);
          const total = calculate(dealerHand);
          if (total > 21) {
            reason = `Дилер достает ${card.display}, в общем ${total}! Дилер проиграл.`;
            win = true;
          } else if (total >= 17) {
            const playerTotal = calculate(playerHand);
            if (total === playerTotal) {
              reason = `${card ? `Дилер достает ${card.display}, всего ` : ''}${playerTotal}-${total}`;
              win = 'ничья'
              break;

            } else if (total > playerTotal) {
              reason = `${card ? `Дилер достает ${card.display}, всего ` : ''}${playerTotal}-\`${total}\``;
              break;
            } else {
              reason = `${card ? `Дилер достает ${card.display}, всего ` : ''}\`${playerTotal}\`-${total}`;
              win = true;
            }
          } else {
            await embed(message).setPrimary(`**Дилер достает карты ${card.display}, в общем ${total}!**`).send();
          }
        }
      }

      ops.games.delete(message.channel.id);


      if (win === true) {
        await mc.giveCoins(message.member.id, message.guild.id, 2 * Math.floor(amount));
        return embed(message).setSuccess(`**${reason}, Вы выиграли ${COIN}${Math.floor(2 * Math.floor(amount))}**!`).send();
      } else if (!win) {
        return embed(message).setError(`**${reason}, Вы проиграли ${COIN}${Math.floor(Math.floor(amount))}**!`).send();

      } else {
        await mc.giveCoins(message.member.id, message.guild.id, Math.floor(amount));
        return embed(message).setPrimary(`👀 **${reason}, У вас ничья!**`).send();
      }
    } catch (err) {
      ops.games.delete(message.channel.id);
      throw err;
    }

    function generateDeck(deckCount) {
      const deck = [];
      for (let i = 0; i < deckCount; i++) {
        for (const suit of suits) {
          deck.push({
            value: 11,
            display: `${suit} Ace!`
          });
          for (let j = 2; j <= 10; j++) {
            deck.push({
              value: j,
              display: `${suit} ${j}`
            });
          }
          for (const face of faces) {
            deck.push({
              value: 10,
              display: `${suit} ${face}`
            });
          }
        }
      }
      return shuffle(deck);
    }

    function draw(channel, hand) {
      const deck = ops.games.get(channel.id).data;
      const card = deck[0];
      deck.shift();
      hand.push(card);
      return card;
    }

    function calculate(hand) {
      return hand.sort((a, b) => a.value - b.value).reduce((a, b) => {
        let {
          value
        } = b;
        if (value === 11 && a + value > 21) value = 1;
        return a + value;
      }, 0);
    }
  }
};
