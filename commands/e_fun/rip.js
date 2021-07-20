const Discord = require("discord.js");
const { AME_API } = require('../../config')
const ameClient = require('amethyste-api')
const AmeAPI = new ameClient(AME_API)

module.exports = {
    config: {
        name: "рип",
        aliases: ['rip'],
        category: 'e_fun',
        description: "Показывает гроб участника!",
        usage: "[ник участника | упоминание | ID] (По желанию)",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {

        let user = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
        let m = await message.channel.send("**Ждите...**");
        let buffer = await AmeAPI.generate("rip", { url: user.user.displayAvatarURL({ format: "png", size: 512 }) });
        let attachment = new Discord.MessageAttachment(buffer, "rip.png");
        m.delete({ timeout: 5000 });
        message.channel.send(attachment);
    }
}
