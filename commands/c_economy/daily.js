const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const profileModel = require("../../profileSchema");

module.exports = {
    config: {
        name: "ежедн-приз",
        aliases: ["day", "daily", "еждн"],
        category: "c_economy",
        description: "Дает 200 монет ежедневно.",
        usage: " ",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {
        let user = message.member;

        let timeout = 86400000;
        let amount = 1000;

        let profileData = await profileModel.findOne({ userID: user.id });
        let daily = await profileData.daily;

        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = new Date(timeout - (Date.now() - daily));

            let timeEmbed = new MessageEmbed()
                .setColor(redlight)
                .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
                .setDescription(`❌ Ты уже собрал свой ежедневный приз.\n\nПопробуй еще раз через **${time.getUTCHours()} часа(ов) ${time.getMinutes()} минут.**`);
            message.channel.send(timeEmbed).then(msg => {msg.delete({timeout: "10000"})});
        } else {
            let moneyEmbed = new MessageEmbed()
                .setColor(cyan)
                .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
                .setDescription(`✅ Ваш ежедневный приз ${amount}${COIN}`);
            message.channel.send(moneyEmbed)

            await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: amount}})
            await profileModel.findOneAndUpdate({userID: user.id}, {$set: {daily: Date.now()}})




        }
    }
}
