const embed = require('../../embedConstructor');
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");
const voiceModel = require("../../models/voiceSchema");

module.exports = {
      config: {
        name: "приват",
        description: "Включить приватные голосовые каналы.",
        usage: "[включить | отключить]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["private", "voice"]
    },
    run: async (bot, message, args) => {

      if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
      if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return embed(message).setError("У меня недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});

      if(!args[0]) return embed(message)
                              .setError('Укажите действие.')
                              .send()

      const server = message.guild;
      const serverData = await serverModel.findOne({serverID: server.id})
      if(args[0] === 'включить' || args[0] === 'on') {
        if(serverData.voiceCategory === null){
        const cat = await server.channels.create('Приватные комнаты', {type: 'category'})
        serverData.voiceCategory = cat.id;
        serverData.save()
        const mainVoice = await server.channels.create(`🖤 Создать комнату`, {type: 'voice'})
        .then( async channel => {
          let findCategory = server.channels.cache.get(serverData.voiceCategory)
          channel.setParent(findCategory.id);
          await serverModel.findOneAndUpdate({serverID: server.id}, {$set: {voiceChannel: channel.id}}) 

          return embed(message)
          .setSuccess('Система приватных голосовых каналов успешно включена.')
          .send()
        }).catch(console.error)

      } else {
        return embed(message)
        .setError('Система приватных голосовых каналов уже включена.\nСначала отключите систему.')
        .send()
      }
    } else if (args[0] === 'отключить' || args[0] === 'off') {
      if(serverData.voiceCategory !== null) {
        server.channels.cache.get(serverData.voiceChannel).delete()
        server.channels.cache.get(serverData.voiceCategory).delete()
        serverData.voiceCategory = null;
        serverData.voiceChannel = null;
        serverData.save()
        return embed(message)
        .setSuccess('Система приватных голосовых каналов успешно отключена.')
        .send()
      } else {
        return embed(message)
        .setError('Система приватных голосовых каналов уже отключена.\nСначала включите систему.')
        .send()
      }
    } else {
      return embed(message)
      .setError('Действие не найдено.')
      .send()
    }

    }
};
