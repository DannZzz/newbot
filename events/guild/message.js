
const { PREFIX } = require('../../config');
const profileModel = require("../../models/profileSchema");
const serverModel = require("../../models/serverSchema");
const memberModel = require("../../models/memberSchema");
const queue2 = new Map();
const queue3 = new Map();
const queue = new Map();
const games = new Map()

module.exports = async (bot, message) => {
    try {
      let profileData;
      let serverData;
      let memberData;
  try {
    profileData = await profileModel.findOne({ userID: message.author.id });
    if (!profileData) {
      let profile = await profileModel.create({
        userID: message.author.id,
        serverID: message.guild.id,
        coins: 1000,
        bank: 0,
        slots: 0,
        rob: 0,
        fish: 0,
        work: 0,
        daily: 0
      });
      profile.save();
    }
  } catch (err) {
    console.log(err);
  }
        if (message.author.bot || message.channel.type === "dm") return;

        let prefix;
        serverData = await serverModel.findOne({ serverID: message.guild.id });
        if(!serverData) {
          let server = await serverModel.create({
            serverID: message.guild.id,
          })
        server.save()}

        prefix = serverData.prefix;

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();

        if (!message.content.startsWith(prefix)) return;

        let ops = {
            queue2: queue2,
            queue: queue,
            queue3: queue3,
            games: games
        }

        var commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd))
        if (commandfile) commandfile.run(bot, message, args, ops, profileData)
    } catch (e) {
        console.log(e);
    }
}
