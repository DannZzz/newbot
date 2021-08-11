const {Client, MessageEmbed, Collection} = require('discord.js');
const voiceCollection = new Collection();
const {PREFIX, TOKEN, MONGO} = require('./config')
const disbut = require("discord-buttons");
const bot = new Client({disableMentions: "everyone"});
disbut(bot);
const fs = require('fs');
const mongoose = require('mongoose');
const mc = require('discordjs-mongodb-currency')
const Levels = require("discord-xp");
Levels.setURL(MONGO);

mc.connect(MONGO)
mongoose.connect(MONGO, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false)

const serverModel = require("./models/serverSchema");
const profileModel = require("./models/profileSchema");
const memberModel = require("./models/memberSchema");
const begModel = require("./models/begSchema");
const vipModel = require("./models/vipSchema");
const voiceModel = require("./models/voiceSchema");

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
    let memberData = await memberModel.findOne({ userID: member.id, serverID: guild.id});
    if (!memberData) {
    let memberr = await memberModel.create({
      userID: member.id,
      serverID: guild.id,
    });
    memberr.save()};

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
      fish: 0,
      daily: 0
    })
    profile.save()}
  }
})

bot.on('voiceStateUpdate', async (oldMember, newMember) => {
    const user = await bot.users.fetch(newMember.id);
    const server = newMember.guild
    const member = server.member(user);
    //let newUserChannel = newMember.channel.id

    let oldUserChannel = oldMember.channel
    const serverData = await serverModel.findOne({serverID: server.id})
    if(serverData.voiceCategory !== null) {
    let channelM = serverData.voiceChannel;
    // console.log(newUserChannel);
    // console.log(channelM);
    let asd;
    let channel;
    if(!oldUserChannel && newMember.channel.id === channelM) {
      channel = await server.channels.create(user.username, {
        type: 'voice',
        parent: server.channels.cache.get(channelM).parent,
        permissionOverwrites: [
          {
            id: user.id,
            allow: ['MANAGE_CHANNELS']
          }
        ]
      });
      member.voice.setChannel(channel)
      voiceCollection.set(user.id, channel.id)

        // let sd = await serverModel.findOne({serverID: newMember.guild.id})
      let newData = voiceModel.create({
      userID: member.user.id,
      serverID: server.id,
      channel: channel.id
      })

    }
  }
})

const checkVoice = async () => {
  const res = await voiceModel.find({channel: {$exists: true}})
  res.forEach(async chan => {
    const guild = await bot.guilds.cache.get(chan.serverID)
    const channel = await guild.channels.cache.get(chan.channel)
    if(channel.members.size === 0) {channel.delete()
    chan.delete()
  }
    else {
      return
    }
  })

  setTimeout(checkVoice, 1000 * 10)
}
checkVoice()
bot.on("guildMemberAdd", async member => {
    let sd = await serverModel.findOne({serverID: member.guild.id})
    if(sd.welcome) {
      let emb = new MessageEmbed()
      .setTimestamp()
      .setAuthor(member.user.tag, member.guild.iconURL({dynamic: true}))
      .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
      .setColor(sd.welcomeColor || '#2f3136')
      .setDescription(sd.welcomeText || `Приветствуем тебя уважаемый участник!`)
      .setImage(sd.welcomeImage)

    let channel = member.guild.channels.cache.get(sd.welcomeChannel);
    if(channel) {
      channel.send(emb)
    } else {
      return
    }
    }

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
    fish: 0,
    daily: 0
  });
  profile.save()};

  let memberData = await memberModel.findOne({ userID: member.id, serverID: member.guild.id});
  if (!memberData) {
  let memberr = await memberModel.create({
    userID: member.id,
    serverID: member.guild.id,
  });
  memberr.save()};
})


bot.on('message', async message => {
  let memberData = await memberModel.findOne({ userID: message.author.id, serverID: message.guild.id });
  if (!memberData) {
  let member = await memberModel.create({
    userID: message.author.id,
    serverID: message.guild.id
  })
  member.save()}
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

    if (!muterole) {muterole = muteerole}
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
