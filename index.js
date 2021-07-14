const {Client, MessageEmbed, Collection} = require('discord.js');
const db = require('quick.db');
const {PREFIX, TOKEN} = require('./config')
const bot = new Client({disableMentions: "everyone"});
const fs = require('fs');

bot.commands = new Collection();
bot.aliases = new Collection();

["aliases", "commands"].forEach(x => bot[x] = new Collection());
["command", "event"].forEach(x => require(`./handler/${x}`)(bot));

bot.categories = fs.readdirSync("./commands/");

['command'].forEach((handler) => {
  require(`./handler/${handler}`)(bot);
});



bot.on('message', async message => {
  let prefix;
    if (message.author.bot || message.channel.type === "dm") return;
        try {
            let fetched = await db.fetch(`prefix_${message.guild.id}`);
            if (fetched === null) {
                prefix = PREFIX
            } else {
                prefix = fetched
            }
        } catch (e) {
            console.log(e)
    };

  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
});

bot.on('message', async message => {
  let Embed = new MessageEmbed()
  .setTimestamp()
  .setColor('#00e6da')
  let prefix;
      try {
          let fetched = await db.fetch(`prefix_${message.guild.id}`);
          if (fetched === null) {
              prefix = PREFIX
          } else {
              prefix = fetched
          }
      } catch (e) {
          console.log(e)
  };
  try {
      if (message.mentions.has(bot.user) && !message.mentions.has(message.guild.id)) {
          return message.channel.send(Embed.setDescription(`Мой префикс для этого сервера: **\`${prefix}\`**`)).then(msg => msg.delete({timeout: "5000"}))
      }
  } catch {
      return;
      };
});

bot.login(TOKEN)
