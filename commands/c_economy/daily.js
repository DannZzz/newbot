const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const begModel = require("../../models/begSchema");
const embed = require('../../embedConstructor');


module.exports = {
    config: {
        name: "ежедн-приз",
        aliases: ["day", "daily", "еждн"],
        category: "c_economy",
        description: "Дает 1000 монет и 3 звезд ежедневно.",
        usage: "",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {
        let user = message.member;


        let amount = 1000;

        let profileData = await profileModel.findOne({ userID: user.id });
        let beg = await begModel.findOne({ userID: user.id })
        let daily = await profileData.daily;
        let timeout;
        if (beg["vip2"] === true) { timeout = 43200 * 1000; } else {
          timeout = 86400 * 1000;
        }


        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = new Date(timeout - (Date.now() - daily));

            embed(message).setError(`Ты уже собрал свой ежедневный приз.\n\nПопробуй еще раз через **${time.getUTCHours()} часа(ов) ${time.getMinutes()} минут.**`).send().then(msg => {msg.delete({timeout: "10000"})});
        } else {
            embed(message).setSuccess(`Ваш ежедневный приз ${amount}${COIN} и 3 ${STAR}`).send()

            await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: amount}})
            await begModel.findOneAndUpdate({userID: user.id},{$inc: {stars: 3}})
            await profileModel.findOneAndUpdate({userID: user.id}, {$set: {daily: Date.now()}})




        }
    }
}
