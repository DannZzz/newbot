const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const ms = require("ms");
const Jwork = require('../../JSON/works.json');
const JworkR = Jwork[Math.floor(Math.random() * Jwork.length)];
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');

module.exports = {
    config: {
        name: "ворк",
        aliases: ["wr", "work"],
        category: "economy",
        description: "Работайте, чтобы зарабатывать деньги.",
        usage: " ",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {

        let user = message.author;
        let author = await db.fetch(`work_${user.id}`)

        let timeout = 1800000;



        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = ms(timeout - (Date.now() - author));

            let timeEmbed = new MessageEmbed()
                .setColor(redlight)
                .setTimestamp()
                .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
                .setDescription(`❌ Вы уже работали недавно\n\nПопробуй снова через **${time}**.`);
            message.channel.send(timeEmbed).then(msg => {msg.delete({timeout: "10000"})});
        } else {
            let amount = Math.floor(Math.random() * 800) + 1;
            let embed1 = new MessageEmbed()
                .setColor(cyan)
                .setTimestamp()
                .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
                .setDescription(`✅ **${JworkR} ${amount}**${COIN}`)
            message.channel.send(embed1)

            db.add(`works_${user.id}`, 1)
            db.add(`money_${user.id}`, amount)
            db.set(`work_${user.id}`, Date.now())
        };
    }
};
