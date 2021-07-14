const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ms = require("ms");
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');

module.exports = {
    config: {
        name: "ежедн-приз",
        aliases: ["day", "daily", "еждн"],
        category: "economy",
        description: "Дает 200 монет ежедневно.",
        usage: " ",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {
        let user = message.author;

        let timeout = 86400000;
        let amount = 1000;

        let daily = await db.fetch(`daily_${user.id}`);

        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = ms(timeout - (Date.now() - daily));

            let timeEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
                .setDescription(`❌ Ты уже собрал свой ежедневный приз.\n\nПопробуй еще раз через ${time}.`);
            message.channel.send(timeEmbed).then(msg => {msg.delete({timeout: "10000"})});
        } else {
            let moneyEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
                .setDescription(`✅ Ваш ежедневный приз ${amount}${COIN}`);
            message.channel.send(moneyEmbed)
            db.add(`money_${user.id}`, amount)
            db.set(`daily_${user.id}`, Date.now())


        }
    }
}
