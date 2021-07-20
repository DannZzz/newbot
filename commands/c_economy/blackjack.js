const { stripIndents } = require('common-tags');
const { shuffle, verify } = require('../../functions');
const suits = ['<:kyap:864965175941791786>', '<:xach:864965176088068096>', '<:xar:864965175764320277>', '<:sirt:864965176330682408>'];
const faces = ['Валет', 'Дама', 'Король'];
const hitWords = ['повысить', 'hit'];
const standWords = ['оставить', 'stand'];
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const profileModel = require("../../profileSchema");


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
        let noEmbed = new MessageEmbed()
        .setColor(redlight)
        .setTimestamp()
        .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

        if (!args[0]) return message.channel.send(noEmbed.setDescription("❌ Укажите кол-во колод!")).then(msg => {msg.delete({timeout: "10000"})});
        let deckCount = parseInt(args[0])
        if (isNaN(args[0])) return message.channel.send(noEmbed.setDescription("❌ Укажите число!")).then(msg => {msg.delete({timeout: "10000"})});
        if (deckCount <= 0 || deckCount >= 9) return message.channel.send(noEmbed.setDescription("❌ Укажите число от 1 до 8!")).then(msg => {msg.delete({timeout: "10000"})});

        let user = message.author;
        let profileData = await profileModel.findOne({ userID: user.id });
        let bal = profileData.coins;

        if (!args[1]) return message.channel.send(noEmbed.setDescription("❌ Укажите ставку!")).then(msg => {msg.delete({timeout: "10000"})})

        let amount = parseInt(args[1])
        if (isNaN(args[1])) return message.channel.send(noEmbed.setDescription("❌ Укажите число!")).then(msg => {msg.delete({timeout: "10000"})})
        if (amount < 100) return message.channel.send(noEmbed.setDescription("❌ Минимальная ставка **100**!")).then(msg => {msg.delete({timeout: "10000"})})
        if (amount > 100000) return message.channel.send(noEmbed.setDescription("❌ Максимальная ставка **100000**!")).then(msg => {msg.delete({timeout: "10000"})})

        if (bal < amount) return message.channel.send(noEmbed.setDescription("❌ У вас недостаточно денег!")).then(msg => {msg.delete({timeout: "10000"})})
        const current = ops.games.get(message.channel.id);
        if (current) return message.channel.send(noEmbed.setDescription(`❌ Пожалуйста подождите пока игра **${current.name}** закончится!`)).then(msg => {msg.delete({timeout: "10000"})})
        try {
            ops.games.set(message.channel.id, { name: 'blackjack', data: generateDeck(deckCount) });
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
                return message.channel.send(noEmbed.setDescription("😂 У вас обоих Блэкджек!"))
            } else if (dealerInitialTotal === 21) {
                ops.games.delete(message.channel.id);
                await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(-amount)}});
                return message.channel.send(noEmbed.setDescription(`❌ У дилера блэкджек!\nВы проиграли **${Math.floor(amount)}**${COIN}`))
            } else if (playerInitialTotal === 21) {
                let embed = new MessageEmbed()
                .setColor(greenlight)
                .setTimestamp()
                .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

                ops.games.delete(message.channel.id);
                await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: Math.floor(amount+(amount/2))}});

                return message.channel.send(embed.setDescription(`✅ У вас блэкджек!\nВы выиграли **${Math.floor(amount + (amount / 2))}**${COIN}`))
            }

            let playerTurn = true;
            let win = false;
            let reason;
            let gameEmbed = new MessageEmbed()
            .setColor(cyan)
            .setTimestamp()
            .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

            while (!win) {
                if (playerTurn) {
                    let msg = await message.channel.send(gameEmbed.setDescription(`
						**Первая карта дилера -** ${dealerHand[0].display}\n\n
						**Вы [${calculate(playerHand)}] -**\n
						**${playerHand.map(card => card.display).join('\n')}**\n\n
                        \`[Повысить / Оставить]\`\n\n
					`));
                    const hit = await verify(message.channel, message.author, { extraYes: hitWords, extraNo: standWords });
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
                        await message.channel.send(gameEmbed.setDescription(`**Вторая карта дилера ${dealerHand[1].display}, в общем ${dealerTotal}!**`));
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
                        await message.channel.send(gameEmbed.setDescription(`**Дилер достает карты ${card.display}, в общем ${total}!**`));
                    }
                }
            }

            ops.games.delete(message.channel.id);

            let winEmbed = new MessageEmbed()
            .setColor(greenlight)
            .setTimestamp()
            .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

            if (win === true) {
                await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: amount}});
                return message.channel.send(winEmbed.setDescription(`✅ **${reason}, Вы выиграли ${COIN}${Math.floor(amount)}**!`));
            }else if (!win){
              await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: -amount}});
              return message.channel.send(noEmbed.setDescription(`❌ **${reason}, Вы проиграли ${COIN}${Math.floor(amount)}**!`));

            } else {
                let Nembed = new MessageEmbed()
                .setColor(cyan)
                .setTimestamp()
                .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))

                return message.channel.send(Nembed.setDescription(`👀 **${reason}, У вас ничья!**`));
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
                let { value } = b;
                if (value === 11 && a + value > 21) value = 1;
                return a + value;
            }, 0);
        }
    }
};
