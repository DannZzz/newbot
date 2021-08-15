const allResp = ['create', 'создать', 'role', 'роль', 'cost', 'цена', 'description', 'описание', 'delete', 'удалить'];
const cr = ["create", 'создать'];
const rl = ["role", 'роль'];
const ct = ['cost', 'цена'];
const ds = ['description', 'описание'];
const del = ['delete', 'удалить']
const {MessageEmbed} = require("discord.js");
const sd = require('../../models/serverSchema.js')
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const ms = require('ms');
const embed = require('../../embedConstructor');
const {error} = require('../../functions');

module.exports = {
  config: {
    name: "предмет",
    description: "Создать/Изменить предмет магазина. (?предмет хелп)",
    category: "c_economy",
    aliases: ["item"],
    accessableby: "Нужна права: Администратор",
    usage: "[действие] (ID предмета) [значение]"
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return error(message, "У вас недостаточно прав.").send().then(msg => {msg.delete({timeout: "10000"})});

    if (!args[0]) return error(message, `Укажите действие. \`\`?item help\`\``);
    // .then(msg => msg.delete({timeout: '10000'}));
    const resp = args[0]
    const help = ['help', 'хелп']
    const server = message.guild;
    let data = await sd.findOne({serverID: server.id});

    function ch (arr, res) {
      return arr.includes(res)
    }

    if(help.includes(resp)) {
      return embed(message).setPrimary(`
      **Все доступные действия!**
      \`\`\`
?предмет создать [название]
?item create [name]

?предмет роль [номер предмета] [доступная роль]
?item role [index of item] [valid role]

?предмет цена [номер предмета] [цена]
?item cost [index of item] [cost]

?предмет описание [номер предмета] [описание]
?item description [index of item] [description]

?предмет удалить [номер предмета]
?item delete [index of item]\`\`\``).send()
    }
    if(!allResp.includes(resp)) return error(message, `Действие не найдено! \`\`?item help\`\``);
    if(ch(cr, resp)) {
      if (!args[1]) return error(message, `Укажите название предмета.`);
      let already =  data.shop.filter(item => item.Name === args[1]);
      if (already.length !== 0) return error(message, `Предмет уже существует.`);

      data.shop.push({
        Name: args[1],
        Role: null,
        Cost: null,
        Description: null
      });
      data.save();

      return embed(message).setSuccess(`Предмет успешно добавлен.`).send()
    } else if (ch(rl, resp)) {
      if(!args[1] || isNaN(args[1])) return error(message, `Укажите номер предмета.`);
      if(args[1] > data.shop.length) return error(message, `Предмет не найден.`);
      if (!args[2] || (!message.mentions.roles.first() && !bot.guilds.cache.get(message.guild.id).roles.cache.get(args[2]))) return error(message, `Укажите доступную роль.`);
      let getID = Math.round(args[1]) - 1
      let role = message.mentions.roles.first() || !bot.guilds.cache.get(message.guild.id).roles.cache.get(args[2])


      await sd.findOneAndUpdate({serverID: server.id}, {$set: {[`shop.${getID}.Role`]: role.id}}).then(() => {
          return embed(message).setSuccess(`Роль успешно установлена.`).send()
      })

    } else if (ch(ct, resp)) {
      if(!args[1] || isNaN(args[1])) return error(message, `Укажите номер предмета.`);
      if(args[1] > data.shop.length) return error(message, `Предмет не найден.`);
      if (!args[2] || isNaN(args[2])) return error(message, `Укажите доступную сумму.`);
      let getID = Math.round(args[1]) - 1

      await sd.findOneAndUpdate({serverID: server.id}, {$set: {[`shop.${getID}.Cost`]: Math.round(args[2])}}).then(() => {
          return embed(message).setSuccess(`Цена успешно установлена.`).send()
      })
    } else if (ch(ds, resp)) {
      if(!args[1] || isNaN(args[1])) return error(message, `Укажите номер предмета.`);
      if(args[1] > data.shop.length) return error(message, `Предмет не найден.`);
      if (!args[2]) return error(message, `Дайте описание предмету.`);
      let getID = Math.round(args[1]) - 1

      await sd.findOneAndUpdate({serverID: server.id}, {$set: {[`shop.${getID}.Description`]: args.slice(2).join(" ")}}).then(() => {
          return embed(message).setSuccess(`Описание успешно установлено.`).send()
      })
    } else if (ch(del, resp)) {
      if(!args[1] || isNaN(args[1])) return error(message, `Укажите номер предмета.`);
      if(args[1] > data.shop.length) return error(message, `Предмет не найден.`);
      let getID = Math.round(args[1]) - 1

      data.shop.splice(getID, 1)
      data.save()
      return embed(message).setSuccess(`Предмет успешно удалён.`).send()
    }

  }
}
