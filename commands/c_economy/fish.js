const fishes = require('../../JSON/fishes.json');
const ms = require("ms");
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const { MessageEmbed } = require('discord.js');
const profileModel = require("../../models/profileSchema");
const begModel = require("../../models/begSchema");
const vipModel = require("../../models/vipSchema");


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

        let beg = await begModel.findOne({userID: user.id});

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

            let timeout;
            if (beg["vip2"] === true) { timeout = 90 * 1000; } else {
              timeout = 180 * 1000;
            }
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
                .setDescription(`**🎣 Вы забросили свою удочку и поймали ${fishh.symbol}**!`)
            message.channel.send(embed);
            if (rarity === "junk") await begModel.findOneAndUpdate({userID: user.id},{$inc: {junk: 1}})
            else if (rarity === "common") await begModel.findOneAndUpdate({userID: user.id},{$inc: {common: 1}})
            else if (rarity === "uncommon") await begModel.findOneAndUpdate({userID: user.id},{$inc: {uncommon: 1}})
            else if (rarity === "rare") await begModel.findOneAndUpdate({userID: user.id},{$inc: {rare: 1}})
            else if (rarity === "legendary") await begModel.findOneAndUpdate({userID: user.id},{$inc: {legendary: 1}})

            await profileModel.findOneAndUpdate({userID: user.id}, {$set: {fish: Date.now()}})


        }
        if (args[0] === 'лист' || args[0] === 'list') {

            let lEmbed = new MessageEmbed()
                .setColor(cyan)
                .setTimestamp()
                .setTitle(`Список рыб, их редкости и цен.`)
                .setDescription(`
\`\`\`🔧Хлам      :: 20 [ID: 1]
🐟Обычная    :: 50 [ID: 2]
🐠Необычная  :: 80 [ID: 3]
🦑Редкая      :: 150 [ID: 4]
🐋Легендарная :: 450 [ID: 5]\`\`\`

​
`)
                .setFooter(message.guild.name, message.guild.iconURL())
            return message.channel.send(lEmbed);
        }
    }
}
