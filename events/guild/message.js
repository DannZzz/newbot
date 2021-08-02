const embed = require('../../embedConstructor');
const { PREFIX } = require('../../config');
const { MessageEmbed } = require('discord.js')
const profileModel = require("../../models/profileSchema");
const serverModel = require("../../models/serverSchema");
const memberModel = require("../../models/memberSchema");
const begModel = require("../../models/begSchema");
const vipModel = require("../../models/vipSchema");
const customModel = require("../../models/customSchema");
const queue2 = new Map();
const queue3 = new Map();
const queue = new Map();
const games = new Map()

module.exports = async (bot, message) => {
    try {
      let profileData;
      let serverData;
      let begData;
      let vipData;
  try {
    vipData = await vipModel.findOne({ userID: message.author.id });
    if (!vipData) {
    let vip = await vipModel.create({
      userID: message.author.id
    })
    vip.save()}

    begData = await begModel.findOne({ userID: message.author.id });
    if (!begData) {
      let beg = await begModel.create({
        userID: message.author.id
      })
      beg.save()
    }

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
        let mes = [
          'привет',
          'хай',
          'всем привет',
          'Всем привет',
          'ку',
          'Хай',
          'Привет',
          'Приветик',
          'приветик',
          'Ку всем',
          'Ку',
          'куу',
          'Куу',
          'куку',
          'Куку',
          'КуКу',
          'Хай всем',
          'доброе утро',
          'привяю',
          'Привяю',
          'Доброе утро'
        ]
        let res = [
          'Заебал',
          'Куу',
          'Куку',
          'Привет',
          'Хай',
          'хватит спамить..',
          'Та привет',
          'ЭХ недоум..',
          'Я думал это я бот',
          'Ку ',
          'Приветик',
          'ляяяяяяя',
          'Пока',
          "МДээ",
          'Гыыыы ку-ку'
        ]
        prefix = serverData.prefix;
        let rand = Math.floor(Math.random() * res.length)
        if(mes.includes(message.content)) message.reply(res[rand])

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();

        if (!message.content.startsWith(prefix)) return;

        let ops = {
            queue2: queue2,
            queue: queue,
            queue3: queue3,
            games: games
        }
        let ss = new MessageEmbed().setColor("#2f3136").setTimestamp()
        var commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd))
        if (commandfile) {commandfile.run(bot, message, args, ops, profileData)}
        else {await customModel.findOne({serverID: message.guild.id, command: cmd}, async(err, data) =>{
        if(err) throw error
        if(data) return message.channel.send(ss.setDescription(data.content));
        else return
        }
        )}
    } catch (e) {
        console.log(e);
    }
}
