
const { MessageEmbed } = require('discord.js')
const ms = require("ms");
const Jwork = require('../../JSON/works.json');
const JworkR = Jwork[Math.floor(Math.random() * Jwork.length)];
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');
const profileModel = require("../../profileSchema");

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

        profileData = await profileModel.findOne({ userID: user.id });
        let author = profileData.work;
        let timeout = 180000;
        var options = {
          era: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          timezone: 'UTC',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        };


        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = new Date(timeout - (Date.now() - author));

            let timeEmbed = new MessageEmbed()
                .setColor(redlight)
                .setTimestamp()
                .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
                .setDescription(`❌ Вы уже работали недавно\n\nПопробуй еще раз через **${time.getMinutes()} минут ${time.getSeconds()} секунд.**.`);
            message.channel.send(timeEmbed).then(msg => {msg.delete({timeout: "10000"})});
        } else {
            let amount = Math.floor(Math.random() * 800) + 1;
            let embed1 = new MessageEmbed()
                .setColor(cyan)
                .setTimestamp()
                .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
                .setDescription(`✅ **${JworkR} ${amount}**${COIN}`)
            message.channel.send(embed1)

            await profileModel.findOneAndUpdate({userID: user.id},{$inc: {coins: amount}})
            await profileModel.findOneAndUpdate({userID: user.id}, {$set: {work: Date.now()}})

        };
    }
};
