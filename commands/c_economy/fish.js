const fishes = require('../../JSON/fishes.json');
const ms = require("ms");
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const { MessageEmbed } = require('discord.js');
const profileModel = require("../../models/profileSchema");


function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
    config: {
        name: 'рыбачить',
        aliases: ['catchfish', 'fish', "рыба"],
        category: 'c_economy',
        description: 'Рыбачить, хм неплохо.',
        usage: '[list | лист] (по желанию)',
        acessableby: 'Для всех'
    },
    run: async (bot, message, args) => {

        let user = message.author;
        let profileData = await profileModel.findOne({ userID: user.id });

        if (!args[0]) {


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
            let fishtime = profileData.fish;

            if (fishtime !== null && timeout - (Date.now() - fishtime) > 0) {
                let time = await new Date(timeout - (Date.now() - fishtime));

                let timeEmbed = new MessageEmbed()
                    .setColor(redlight)
                    .setTimestamp()
                    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
                    .setDescription(`❌ Вы недавно рыбачили.\n\nПопробуй еще раз через **${time.getMinutes()} минут ${time.getSeconds()} секунд.**`);
                return message.channel.send(timeEmbed).then(msg => {msg.delete({timeout: "10000"})});
            }

            let embed = new MessageEmbed()
                .setColor(greenlight)
                .setTimestamp()
                .setDescription(`**🎣 Вы забросили свою удочку и поймали ${fishh.symbol}, И это было продано за ${COIN}${worth}**!`)
            message.channel.send(embed);

            await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: worth}})
            await profileModel.findOneAndUpdate({userID: user.id}, {$set: {fish: Date.now()}})


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