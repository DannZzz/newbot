const fishes = require('../../JSON/fishes.json');
let db = require('quick.db');
const ms = require("ms");
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const { MessageEmbed } = require('discord.js');

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
    config: {
        name: 'рыбачить',
        aliases: ['catchfish', 'fish', "рыба"],
        category: 'economy',
        description: 'Рыбачить, хм неплохо.',
        usage: '[list | лист] (по желанию)',
        acessableby: 'Для всех'
    },
    run: async (bot, message, args) => {

        let user = message.author;

        let bal = db.fetch(`money_${user.id}`)

        let fish = await db.fetch(`fish_${user.id}`)
        if (!args[0]) {
            if (bal === null) bal = 0;

            if (fish == null) fish = 0;

            const fishID = Math.floor(Math.random() * 10) + 1;
            let rarity;
            if (fishID < 5) rarity = 'junk';
            else if (fishID < 8) rarity = 'common';
            else if (fishID < 9) rarity = 'uncommon';
            else if (fishID < 10) rarity = 'rare';
            else rarity = 'legendary';
            const fishh = fishes[rarity];
            const worth = randomRange(fishh.min, fishh.max);

            let timeout = 180000;
            let fishtime = await db.fetch(`fishtime_${user.id}`);

            if (fishtime !== null && timeout - (Date.now() - fishtime) > 0) {
                let time = ms(timeout - (Date.now() - fishtime));

                let timeEmbed = new MessageEmbed()
                    .setColor(redlight)
                    .setTimestamp()
                    .setDescription(`❌ Вы недавно рыбачили.\n\nПопробуй еще раз через ${time}.`);
                return message.channel.send(timeEmbed).then(msg => {msg.delete({timeout: "10000"})});
            }

            let embed = new MessageEmbed()
                .setColor(greenlight)
                .setTimestamp()
                .setDescription(`**🎣 Вы забросили свою удочку и поймали ${fishh.symbol}, И это было продано за ${COIN}${worth}**!`)
            message.channel.send(embed);

            db.add(`money_${user.id}`, worth);
            db.add(`fish_${user.id}`, 1);
            db.set(`fishtime_${user.id}`, Date.now())
        }
        if (args[0] === 'лист' || args[0] === 'list') {

            let lEmbed = new MessageEmbed()
                .setColor(cyan)
                .setTimestamp()
                .setTitle(`Список рыб, их редкости и цен.`)
                .setDescription(`
\`\`\`🔧Хлам      :: Макс: 30, Мин: 10
🐟Обычная    :: Макс: 70, Мин: 30
🐠Необычная  :: Макс: 90, Мин: 50
🦑Редкая      :: Макс: 175, Мин: 130
🐋Легендарная :: Макс: 500, Мин: 100\`\`\`
**Все рандомно, от минимальной до максимума.**
​
`)
                .setFooter(message.guild.name, message.guild.iconURL())
            return message.channel.send(lEmbed);
        }
    }
}
