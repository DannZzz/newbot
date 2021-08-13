const embed = require('../../embedConstructor');
const { MessageEmbed } = require('discord.js')
const ms = require("ms");
const Jwork = require('../../JSON/works.json');
const JworkR = Jwork[Math.floor(Math.random() * Jwork.length)];
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const memberModel = require("../../models/memberSchema");
const begModel = require("../../models/begSchema");
const mc = require('discordjs-mongodb-currency');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
    config: {
        name: "ворк",
        aliases: ["wr", "work"],
        category: "c_economy",
        description: "Работайте, чтобы зарабатывать деньги.",
        usage: "",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {
        let limited = rateLimiter.take(message.author.id)
        if(limited) return
        let user = message.author;

        let memberData = await memberModel.findOne({ userID: user.id, serverID: message.guild.id });
        let bag = await begModel.findOne({ userID: user.id });

        let author = memberData.work;

        let timeout;
        if (bag["vip2"] === true) { timeout = 90 * 1000; } else {
          timeout = 180 * 1000;
        }
        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = new Date(timeout - (Date.now() - author));

            embed(message).setError(`Вы уже работали недавно\n\nПопробуй еще раз через **${time.getMinutes()} минут ${time.getSeconds()} секунд.**.`).send().then(msg => {msg.delete({timeout: "10000"})});
        } else {
            await memberModel.findOneAndUpdate({userID: user.id, serverID: message.guild.id}, {$set: {work: Date.now()}})

            let amount = Math.floor(Math.random() * 800) + 1;
            embed(message).setSuccess(`**${JworkR} ${amount}**${COIN}`).send()

            await mc.giveCoins(message.member.id, message.guild.id, amount);

        };
    }
};
