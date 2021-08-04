const Discord = require('discord.js');
const {cyan} = require('../../JSON/colours.json');
const embed = require('../../embedConstructor');
const serverModel = require("../../models/serverSchema");
const begModel = require("../../models/begSchema");

module.exports = {
      config: {
        name: "приветствие",
        description: "Установить приветствие сервера.",
        usage: "[действие] (параметр)",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["welcome"]
    },
    run: async (bot, message, args) => {
      if (!message.member.hasPermission("ADMINISTRATOR")) return embed(message).setError("У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});
      if (!args[0]) return embed(message).setError(`Укажите действие!\n\`\`?приветствие лист\`\`\n\`\`Действия: картина, текст, цвет, канал\`\``).send()
      const option = args[0];
      const serverData = await serverModel.findOne({serverID: message.guild.id});
      if (option === 'on' || option === 'включить') {
        if(serverData.welcome === false) {
          serverData.welcome = true
          serverData.save()
          return embed(message).setSuccess(`Приветствие успешно включено.`).send()
        } else {
          return embed(message).setError(`Приветствие и так включено.`).send()
        }
      } else if (option === 'off' || option === 'отключить') {
        if(serverData.welcome === true) {
          serverData.welcome = false
          serverData.save()
          return embed(message).setSuccess(`Приветствие успешно отключено.`).send()
        } else {
          return embed(message).setError(`Приветствие и так отключено.`).send()
        }
      } else if (option === 'list' || option === 'лист') {
        return embed(message).setPrimary(`
          **Установленные действия.**
          Картина - ${`[Ссылка](${serverData.welcomeImage})` || `Не установлена.`}
          Текст - \`\`${serverData.welcomeText || `Не установлен.`}\`\`
          Канал - ${message.guild.channels.cache.get(serverData.welcomeChannel) || `\`\`Не установлен.\`\``}
          Цвет - \`\`${serverData.welcomeColor || `Не установлен.`}\`\`
          `).send()
      }
      if (!args[1]) return embed(message).setError(`Укажите параметр действий.\n\`\`Например: ?приветствие картина хелп\`\``).send()
      const prop = args.splice(1).join(' ');
      const checkVip = await begModel.findOne({userID: message.author.id});


      if (option === 'картина' || option === 'image') {
        if(checkVip['vip2']) {
          if(prop === 'help' || prop === 'хелп') {
            return embed(message).setPrimary(`
              **?приветствие картина [ссылка на картину, можно и гифку]**
              `).send()
          } else {
            serverData.welcomeImage = prop;
            serverData.save()
            embed(message).setSuccess(`Успешно установлена картина для приветствие.`).send()
          }
        } else {
          return embed(message).setError(`Эта команда доступна только для **VIP 2** пользователей.`).send()
        }
      } else if (option === 'текст' || option === 'text') {
        if(prop === 'help' || prop === 'хелп') {
          return embed(message).setPrimary(`
            **?приветствие текст [текст приветствий]**
            `).send()
        } else {
          serverData.welcomeText = `${prop}`;
          serverData.save()
          embed(message).setSuccess(`Успешно установлен текст сообщений для приветствие.`).send()
        }
      } else if (option === 'color' || option === 'цвет') {
        if(prop === 'help' || prop === 'хелп') {
          return embed(message).setPrimary(`
            **?приветствие цвет [цвет EMBED (Например: #0f0f0f)]**
            `).send()
        } else {
          serverData.welcomeColor = prop;
          serverData.save()
          embed(message).setSuccess(`Успешно установлен цвет сообщений для приветствие.`).send()
        }
      } else if (option === 'канал' || option === 'channel') {
        if(prop === 'help' || prop === 'хелп') {
          return embed(message).setPrimary(`
            **?приветствие канал [название текстового канала | упоминание | ID]**
            `).send()
        } else {
          let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[1]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
          if (!channel) return embed(message).setError(`Канал не найден!`).send()
          serverData.welcomeChannel = channel.id;
          serverData.save()
          embed(message).setSuccess(`Успешно установлен канал сообщений для приветствие.`).send()
        }
      } else {
        return embed(message).setError('Действие не найдено!').send()
      }

    }
}
