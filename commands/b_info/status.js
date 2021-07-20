const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');

module.exports = {
    config: {
        name: "статус",
        category: "b_info",
        aliases: ["status"],
        description: "Информация о статусе участника.",
        usage: "[имя участник | упоминание | ID]",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

        if (!user.presence.activities.length) {
            const sembed = new MessageEmbed()
                .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
                .setColor(redlight)
                .setThumbnail(user.user.displayAvatarURL())
                .addField("**Статус не найден!**", 'Этот участник не имеет статус!')
                .setFooter(message.guild.name, message.guild.iconURL())
                .setTimestamp()
            message.channel.send(sembed)
            return undefined;
        }

        user.presence.activities.forEach((activity) => {

            if (activity.type === 'CUSTOM_STATUS') {
                const embed = new MessageEmbed()
                    .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
                    .setColor(cyan)
                    .addField("** **", `**Польз. статус** -\n${activity.state}`)
                    .setThumbnail(user.user.displayAvatarURL())
                    .setFooter(message.guild.name, message.guild.iconURL())
                    .setTimestamp()
                message.channel.send(embed)
            }
            else if (activity.type === 'PLAYING') {
                let name1 = activity.name
                let details1 = activity.details
                let state1 = activity.state
                let image = user.user.displayAvatarURL({ dynamic: true })

                const sembed = new MessageEmbed()
                    .setAuthor(`${user.user.username}'s Activity`)
                    .setColor(cyan)
                    .setThumbnail(image)
                    .addField("**Тип:**", "Играет:")
                    .addField("**Игра:**", `${name1}`)
                    .addField("**Детали:**", `${details1 || "Нет детали"}`)
                    .addField("**Работает над:**", `${state1 || "Не найден"}`)
                message.channel.send(sembed);
            }
            else if (activity.type === 'LISTENING' && activity.name === 'Spotify' && activity.assets !== null) {

                let trackIMG = `https://i.scdn.co/image/${activity.assets.largeImage.slice(8)}`;
                let trackURL = `https://open.spotify.com/track/${activity.syncID}`;

                let trackName = activity.details;
                let trackAuthor = activity.state;
                let trackAlbum = activity.assets.largeText;

                trackAuthor = trackAuthor.replace(/;/g, ",")

                const embed = new MessageEmbed()
                    .setAuthor('Spotify Трек Инфо', 'https://cdn.discordapp.com/emojis/408668371039682560.png')
                    .setColor("GREEN")
                    .setTimestamp()
                    .setThumbnail(trackIMG)
                    .addField('Название песни:', trackName, true)
                    .addField('Альбом:', trackAlbum, true)
                    .addField('Автор', trackAuthor, false)
                    .addField('** **', `[Слушать в Spotify](${trackURL})`, false)
                    .setFooter(user.displayName, user.user.displayAvatarURL({ dynamic: true }))
                message.channel.send(embed);
            }
        })
    }
}
