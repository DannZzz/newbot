const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK } = require('../../config');

module.exports = {
    config: {
        name: "топ",
        aliases: ['lb', "top", "лидеры"],
        category: 'economy',
        description: 'Показывает топ 10 богатых участников по банку сервера.',
        usage: ' ',
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {
        let money = db.all().filter(data => data.ID.startsWith(`bank_`)).sort((a, b) => b.data - a.data);

        if (!money.length) {
            let noEmbed = new MessageEmbed()
                .setAuthor(message.member.displayName, message.author.displayAvatarURL())
                .setColor(cyan)
                .setFooter('Тут пока некого.')
            return message.channel.send(noEmbed)
        };

        money.length = 10;
        var finalLb = "";
        for (var i in money) {
            if (money[i].data === null) money[i].data = 0
            finalLb += `${money.indexOf(money[i]) + 1}. **${message.guild.members.cache.get(money[i].ID.split('_')[1]) ? message.guild.members.cache.get(money[i].ID.split('_')[1]) : "НепонятныйУчастник#0000"}** - ${COIN}${money[i].data}\n`;
        };

        const embed = new MessageEmbed()
            .setTitle(`Банк сервера - ${message.guild.name}`)
            .setColor(cyan)
            .setDescription(finalLb)
            .setFooter(bot.user.tag, bot.user.displayAvatarURL())
            .setTimestamp()
        message.channel.send(embed);
    }
};
