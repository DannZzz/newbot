const {MessageEmbed} = require("discord.js");
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const progressbar = require('string-progressbar');

module.exports = {
    config: {
        name: "шип",
        aliases: ['ship'],
        category: 'e_fun',
        description: "Показывает совместимость с участникамии и обычными предметами.",
        usage: "[ник участника | упоминание | ID | какой-то предмет]",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {

        // let user = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase());
        //
        // if(!user) {
        //   const newMsg = new MessageEmbed()
        //   .setColor(cyan)
        // }

        // Assaign values to total and current values
        // var total = 100;
        // var current = 50;
        // // First two arguments are mandatory
        // message.channel.send(progressbar.splitBar(total, current, [10, ""]));
        function progressBar(perc, ofMaxValue, size, line = '❤', slider = '🖤') {
        if (!perc) throw new Error('Perc value is either not provided or invalid');
        if (!current && current !== 0) throw new Error('Current value is either not provided or invalid');
        if (isNaN(perc)) throw new Error('Perc value is not an integer');
        if (isNaN(ofMaxValue)) throw new Error('ofMaxValue value is not an integer');
        if (isNaN(size)) throw new Error('Size is not an integer');
        const percentage = perc / ofMaxValue; // Calculate the percentage of the bar
        const progress = Math.round((size * percentage)); // Calculate the number of square caracters to fill the progress side.
        const emptyProgress = size - progress; // Calculate the number of dash caracters to fill the empty progress side.

        const progressText = line.repeat(progress); // Repeat is creating a string with progress * caracters in it
        const emptyProgressText = slider.repeat(emptyProgress); // Repeat is creating a string with empty progress * caracters in it
        const percentageText = Math.round(percentage * 100) + '%'; // Displaying the percentage of the bar

        const bar = '[' + progressText + emptyProgressText + ']' + percentageText + ''; // Creating the bar
        message.channel.send(bar);
        }
    }
}
