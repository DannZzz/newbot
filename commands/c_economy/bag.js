const profileModel = require("../../models/profileSchema");
const memberModel = require("../../models/memberSchema");
const begModel = require("../../models/begSchema");
const fishes = require('../../JSON/fishes.json');
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR, MONGO } = require('../../config');
const vipModel = require("../../models/vipSchema");
const Levels = require("discord-xp");
Levels.setURL(MONGO);
module.exports = {
  config: {
    name: 'профиль',
    aliases: ['bag', 'profile', 'сумка'],
    category: 'c_economy',
    description: 'Смотреть профиль.',
    usage: '',
    acessableby: 'Для всех'
  },
  run: async (bot, message, args) => {

    let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
    let person = await Levels.fetch(member.user.id, message.guild.id, true)
    let embed = new MessageEmbed()
    .setTimestamp()
    .setColor(cyan)
    .setAuthor(`Профиль: ` + member.user.tag , member.user.displayAvatarURL({dynamic: true}))


    let data = await begModel.findOne({ userID: member.id });
    let vip = '**0** <a:vip:867867143915438100>'
    let checkVip = await vipModel.findOne({ userID: member.id })
    if(data["vip1"] && data["vip2"]) vip ="**2** <a:vip2:867868958459166751>";
    else if (data["vip1"]) vip = '**1** <a:vip1:867868958877810748>';


    if(data["vip1"] && checkVip.profileImage !== null && data["vip2"]) embed.setImage(checkVip.profileImage);
    if(data["vip1"] && checkVip.profileThumbnail !== null) embed.setThumbnail(checkVip.profileThumbnail);




      embed.addField(`**VIP** - ${vip}`, `${STAR} ${data.stars}\n**XP:** ${person.xp || 0}\n\n`)
      embed.addField(`__Рыбы__\n`,
    `\`\`\`Хлам(🔧) - ${data.junk}\nОбычная(🐟) - ${data.common}\nНеобычная(🐠) - ${data.uncommon}\nРедкая(🦑) - ${data.rare}\nЛегенда(🐋) - ${data.legendary}\`\`\`\n`, true)


    if(data["vip1"] && checkVip.profileBio !== null) embed.addField('Обо мне:',checkVip.profileBio, true);

    message.channel.send(embed)
  }
}
