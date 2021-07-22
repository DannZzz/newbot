const {Client, MessageEmbed, Collection} = require('discord.js');

const {PREFIX, TOKEN} = require('./config')
const disbut = require("discord-buttons");
const bot = new Client({disableMentions: "everyone"});
disbut(bot);
const fs = require('fs');
const mongoose = require('mongoose');
const mc = require('discord-mongo-currency')

mongoose.connect('mongodb+srv://DannTest:DannTestDiscord@botdiscord.hkvvx.mongodb.net/test', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false)

const serverModel = require("./models/serverSchema");
const profileModel = require("./models/profileSchema");
const memberModel = require("./models/memberSchema");

bot.commands = new Collection();
bot.aliases = new Collection();

["aliases", "commands"].forEach(x => bot[x] = new Collection());
["command", "event"].forEach(x => require(`./handler/${x}`)(bot));

bot.categories = fs.readdirSync("./commands/");

['command'].forEach((handler) => {
  require(`./handler/${handler}`)(bot);
});

bot.on("guildCreate", async guild => {
  let serverData = await serverModel.findOne({ serverID: guild.id });
  if(!serverData) {
    let server = await serverModel.create({
      serverID: guild.id,
    })
  server.save()}


    let profileData = await profileModel.findOne({ userID: member.id });
    if (!profileData) {
    let profile = await profileModel.create({
      userID: member.id,
      serverID: member.guild.id,
      coins: 1000,
      bank: 0,
      slots: 0,
      rob: 0,
      fish: 0,
      work: 0,
      daily: 0
    })
    profile.save()}
  })



bot.on("guildMemberAdd", async member => {
    let sd = await serverModel.findOne({serverID: member.guild.id})
    if(sd.autoRoleOn){
      var role = member.guild.roles.cache.find(role => role.id == sd.autoRole);
      if (role) {
        member.roles.add(role);
      }
    }

  let profileData = await profileModel.findOne({ userID: member.id });
  if (!profileData) {
  let profile = await profileModel.create({
    userID: member.id,
    serverID: member.guild.id,
    coins: 1000,
    bank: 0,
    slots: 0,
    rob: 0,
    fish: 0,
    work: 0,
    daily: 0
  });
  profile.save()};
})


bot.on('message', async message => {
  let prefix;
    if (message.author.bot || message.channel.type === "dm") return;
        try {
          let serverData = await serverModel.findOne({ serverID: message.guild.id });
          if(!serverData) {
            let server = await serverModel.create({
              serverID: message.guild.id,
            })
          server.save()}

          prefix = serverData.prefix;

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
        let serverData = await serverModel.findOne({ serverID: message.guild.id });
        if(!serverData) {
          let server = await serverModel.create({
            serverID: message.guild.id,
          })
        server.save()}

        prefix = serverData.prefix;
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
