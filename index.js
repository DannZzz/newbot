const {Client, MessageEmbed, Collection} = require('discord.js');

const {PREFIX, TOKEN, MONGO} = require('./config')
const disbut = require("discord-buttons");
const bot = new Client({disableMentions: "everyone"});
disbut(bot);
const fs = require('fs');
const mongoose = require('mongoose');
const mc = require('discord-mongo-currency')
const Levels = require("discord-xp");
Levels.setURL(MONGO);

mongoose.connect(MONGO, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false)

const serverModel = require("./models/serverSchema");
const profileModel = require("./models/profileSchema");
const memberModel = require("./models/memberSchema");
const begModel = require("./models/begSchema");
const vipModel = require("./models/vipSchema");

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

  for (let member in guild.members){
    let vipData = await vipModel.findOne({ userID: member.id });
    if (!vipData) {
    let vip = await vipModel.create({
      userID: member.id
    })
    vip.save()}
    let begData = await begModel.findOne({ userID: member.id });
    if(!begData) {
      let beg = await begModel.create({
        userID: member.id,
      })
      beg.save();
    }

    let profileData = await profileModel.findOne({ userID: member.id });
    if (!profileData) {
    let profile = await profileModel.create({
      userID: member.id,
      serverID: guild.id,
      coins: 1000,
      bank: 0,
      slots: 0,
      rob: 0,
      fish: 0,
      work: 0,
      daily: 0
    })
    profile.save()}
  }
})


bot.on("guildMemberAdd", async member => {
    let sd = await serverModel.findOne({serverID: member.guild.id})
    if(sd.autoRoleOn){
      var role = member.guild.roles.cache.find(role => role.id == sd.autoRole);
      if (role) {
        member.roles.add(role);
      }
    }

    let vipData = await vipModel.findOne({ userID: member.id });
    if (!vipData) {
    let vip = await vipModel.create({
      userID: member.id
    })
    vip.save()}

  let begData = await begModel.findOne({ userID: member.id });
  if(!begData) {
    let beg = await begModel.create({
      userID: member.id,
    })
    beg.save();
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
        const server = await serverModel.findOne( {serverID: message.guild.id});
        if (server.rank) {
          let random = Math.floor(Math.random() * 4) + 1;
          if (message.author.bot) return;
          if (message.channel.type === "dm") return;
          await Levels.appendXp(message.author.id, message.guild.id, random);

        }

      } catch (e) {
          console.log('error')
  };
  try {
      if (message.mentions.has(bot.user) && !message.mentions.has(message.guild.id)) {
          return message.channel.send(Embed.setDescription(`Мой префикс для этого сервера: **\`${prefix}\`**`)).then(msg => msg.delete({timeout: "5000"}))
      }
  } catch {
      return;
      };
});

const checkMutes = async () => {
  console.log("CHECKING MUTES!");


const results = await memberModel.find({ muteTime: { $exists: true } });
results.map(async user => {
  const nowDate = new Date()
  const muteDate = new Date(user.muteTime)

  const guild = bot.guilds.cache.get(user.serverID)

  const member = (await guild.members.fetch()).get(user.userID)
  if(!member) return

  const server = await serverModel.findOne({serverID: user.serverID})

  if (nowDate < muteDate) return

  let muterole;
  let dbmute = server.muteRole;
  let muteerole = guild.roles.cache.find(r => r.name === "Замучен")

  if (!guild.roles.cache.has(dbmute)) {
    muterole = muteerole
  } else {
    muterole = guild.roles.cache.get(dbmute)
  }


    if(member.roles.cache.has(muterole.id)) {
      member.roles.remove(muterole)
      await memberModel.updateOne({userID: user.userID, serverID: user.serverID}, {$set: {muteTime: null}})
    }
  })

setTimeout(checkMutes, 1000 * 10)
}
checkMutes()

bot.on('guildMemberAdd', async member => {
  const { guild, id} = member

  const currentMute = await memberModel.findOne({
    userID: id,
    serverID: guild.id,
    muteTime: { $exists: true }
  })
  if (currentMute) {
    const server = await serverModel.findOne({serverID: guild.id})
    const role = guild.roles.cache.find(role => role.id === server.muteRole)
    if(role) {
      member.roles.add(role)
    }
  }
})

bot.login(TOKEN)
