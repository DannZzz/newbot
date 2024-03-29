const { MessageEmbed, MessageButton } = require("discord.js");
const { readdirSync } = require("fs");
const serverModel = require("../../models/serverSchema")
const { stripIndents } = require("common-tags");
const { cyan } = require("../../JSON/colours.json");
const { PREFIX, DISAGREE } = require('../../config');
const {pagination} = require("../../functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
    config: {
        name: "хелп",
        aliases: ["х", 'help', "помощь"],
        usage: "[команда] (по желанию)",
        category: "b_info",
        description: "Выдает все доступные команды.",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return

        let prefix;
        let serverData = await serverModel.findOne({ serverID: message.guild.id });
        if(!serverData) {
          let server = await serverModel.create({
            serverID: message.guild.id,
          })
        server.save()}

        prefix = serverData.prefix;
        let catArray = ['RPG', 'игра', 'roleplay', 'rpg', 'информация', 'инфо', 'info', 'экономика', 'economy', 'реакционные', 'реакция', 'reaction', 'фан', 'fun', 'настройки', 'settings', 'VIP', 'vip']
        const embed = new MessageEmbed()
            .setColor(cyan)
            .setAuthor(`${message.guild.me.displayName} | Хелп`, message.guild.iconURL())
            .setThumbnail(bot.user.displayAvatarURL())

        if (!args[0]) {


            const categories = readdirSync("./commands/")

            embed.setDescription(`**Привет! я ${message.guild.me.displayName}\nМой глобальный префикс: \`${PREFIX}\`\nМой префикс на этом сервере: \`${prefix}\`\nЕще больше информации:\n\`${prefix}хелп [категория]\n${prefix}хелп [команда | псевдоним]\`**`)
            embed.setFooter(`${message.guild.me.displayName} | Кол-во команд: ${bot.commands.size-5} `, bot.user.displayAvatarURL());

            let a = categories.map(category => {
                const dir = bot.commands.filter(c => c.config.category === category);
                if(category === "b_info") {category = "Информация"}
                else if (category === "a_moderation") {
                  category = "Модерация"
                }
                else if (category === "g_vip") {
                  category = "VIP"
                }
                else if (category === "e_fun") {
                  category = "Фан"
                }
                else if (category === "h_roleplay") {
                  category = "Ролевая Игра(RPG)"
                }
                else if (category === "d_reaction") {
                  category = "Реакционные"
                }
                else if (category === "c_economy") {
                  category = "Экономика"
                }
                else if (category === "f_settings") {
                  category = "Настройки"//
                }
                return category.slice(0, 1).toUpperCase() + category.slice(1) + ` [${dir.size}]`;

            })
            a.pop()
            embed.addField(`Все доступные категории:`, `\`\`\`${a.join("\n")}\`\`\``)

            return message.channel.send({embeds: [embed]})
        }else if(catArray.includes(args[0]) && !args[1]) {
          let func = c => `**${prefix}${c.config.name}** -  ${c.config.description || "Нет описания."} \n\`${ c.config.usage ? `\`Применение: ${prefix}${c.config.name} ${c.config.usage}\`` : "\`Нет применения.\`"}\`\n\`Псевдонимы: ${c.config.aliases ? c.config.aliases.join(", ") : "Нету."}\``
          let description;
          let description1;
          let description2;
          let description3;
          let description4;
          let eembed = new MessageEmbed()
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )
          let pages;
          if(args[0] === 'модерация' || args[0] === 'модер' || args[0] === 'moder') {

            description = new MessageEmbed()
              .setDescription(
              '**Категория "Модерация"**\n\n' + bot.commands.filter(c => c.config.category === 'a_moderation').map(func)
                .slice(0, 5)
                .join("\n\n"))
            description1 = new MessageEmbed()
              .setDescription(
              '**Категория "Модерация"**\n\n' + bot.commands.filter(c => c.config.category === 'a_moderation').map(func)
                .slice(5, 10)
                .join("\n\n"))
            description2 = new MessageEmbed()
              .setDescription(
              '**Категория "Модерация"**\n\n' + bot.commands.filter(c => c.config.category === 'a_moderation').map(func)
                .slice(10, 15)
                .join("\n\n"))

          } else if(args[0] === 'информация' || args[0] === 'инфо' || args[0] === 'info') {

            description = new MessageEmbed()
              .setDescription(
                '**Категория "Информация"**\n\n' + bot.commands.filter(c => c.config.category === 'b_info').map(func)
                .slice(0, 5)
                .join("\n\n"))

            description1 = new MessageEmbed()
              .setDescription(
              '**Категория "Информация"**\n\n' + bot.commands.filter(c => c.config.category === 'b_info').map(func)
              .slice(5, 10)
              .join("\n\n"))

          } else if(args[0] === 'игра' || args[0] === 'roleplay' || args[0] === 'rpg' || args[0] === 'RPG') {

            description = new MessageEmbed()
              .setDescription(
                '**Категория "Ролевая Игра"**\n\n' + bot.commands.filter(c => c.config.category === 'h_roleplay').map(func)
                .slice(0, 5)
                .join("\n\n"))

            description1 = new MessageEmbed()
              .setDescription(
              '**Категория "Ролевая Игра"**\n\n' + bot.commands.filter(c => c.config.category === 'h_roleplay').map(func)
              .slice(5, 10)
              .join("\n\n"))
              
              description2 = new MessageEmbed()
              .setDescription(
              '**Категория "Ролевая Игра"**\n\n' + bot.commands.filter(c => c.config.category === 'h_roleplay').map(func)
              .slice(10, 15)
              .join("\n\n")) 

          } else if(args[0] === 'экономика' || args[0] === 'economy') {

            description = new MessageEmbed()
              .setDescription(
              '**Категория "Экономика"**\n\n' + bot.commands.filter(c => c.config.category === 'c_economy').map(func)
                .slice(0, 5)
                .join("\n\n"))
            description1 = new MessageEmbed()
              .setDescription(
              '**Категория "Экономика"**\n\n' + bot.commands.filter(c => c.config.category === 'c_economy').map(func)
                .slice(5, 10)
                .join("\n\n"))
            description2 = new MessageEmbed()
              .setDescription(
              '**Категория "Экономика"**\n\n' + bot.commands.filter(c => c.config.category === 'c_economy').map(func)
                .slice(10, 15)
                .join("\n\n"))
            description3 = new MessageEmbed()
              .setDescription(
              '**Категория "Экономика"**\n\n' + bot.commands.filter(c => c.config.category === 'c_economy').map(func)
                .slice(15, 20)
                .join("\n\n"))

          } else if(args[0] === 'реакционные' || args[0] === 'reaction' || args[0] === 'реакция') {

            description = new MessageEmbed()
              .setDescription(
                '**Категория "Реакционные"**\n\n' + bot.commands.filter(c => c.config.category === 'd_reaction').map(func)
                .slice(0, 5)
                .join("\n\n"))
            description1 = new MessageEmbed()
              .setDescription(
              '**Категория "Реакционные"**\n\n' + bot.commands.filter(c => c.config.category === 'd_reaction').map(func)
              .slice(5, 10)
              .join("\n\n"))
            description2 = new MessageEmbed()
              .setDescription(
              '**Категория "Реакционные"**\n\n' + bot.commands.filter(c => c.config.category === 'd_reaction').map(func)
              .slice(10, 15)
              .join("\n\n"))

          } else if(args[0] === 'фан' || args[0] === 'fun') {

            let fun = new MessageEmbed()
              .setColor(cyan)
              .setDescription(
                '**Категория "Фан"**\n\n' + bot.commands.filter(c => c.config.category === 'e_fun').map(func)
                .slice(0, 5)
                .join("\n\n"))

          return message.channel.send({embeds: [fun]})


          } else if(args[0] === 'настройки' || args[0] === 'settings') {

            description = new MessageEmbed()
              .setDescription(
                '**Категория "Настройки"**\n\n' + bot.commands.filter(c => c.config.category === 'f_settings').map(func)
                .slice(0, 5)
                .join("\n\n"))
            description1 = new MessageEmbed()
              .setDescription(
              '**Категория "Настройки"**\n\n' + bot.commands.filter(c => c.config.category === 'f_settings').map(func)
              .slice(5, 10)
              .join("\n\n"))
            description2 = new MessageEmbed()
              .setDescription(
              '**Категория "Настройки"**\n\n' + bot.commands.filter(c => c.config.category === 'f_settings').map(func)
              .slice(10, 15)
              .join("\n\n"))

          } else if(args[0] === 'VIP' || args[0] === 'vip') {

            description = new MessageEmbed()
              .setDescription(
                '**Категория "VIP"**\n\n' + bot.commands.filter(c => c.config.category === 'g_vip').map(func)
                .slice(0, 5)
                .join("\n\n"))
            description1 = new MessageEmbed()
              .setDescription(
              '**Категория "VIP"**\n\n' + bot.commands.filter(c => c.config.category === 'g_vip').map(func)
              .slice(5, 10)
              .join("\n\n"))
          }
          pages = [description, description1, description2]
          if(!description2) { pages = [description.setColor(cyan), description1.setColor(cyan)] } else { pages = [description.setColor(cyan), description1.setColor(cyan), description2.setColor(cyan)] }
          if(description3 !== undefined) pages.push(description3.setColor(cyan))

          const emojies = ['⏪', '◀️', '⏹️', '▶️', '⏩']

          const timeout = 100000

          const button1 = new MessageButton()
                .setCustomId('previousbtn')
                .setLabel('Предыдущая')
                .setStyle('DANGER');

                const button2 = new MessageButton()
                .setCustomId('nextbtn')
                .setLabel('Следующая')
                .setStyle('SUCCESS');

          let buttonList = [
              button1,
              button2
          ]

          const userids = [message.author.id]

          pagination(message, pages, buttonList, timeout, userids)
        } else {
            let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
            if (!command) return message.channel.send({embeds: [embed.setTitle(`${DISAGREE} **Не правильная команда!**`).setDescription(`**Пишите \`${prefix}хелп\` чтобы посмотреть все доступные команды бота!**`)]})
            command = command.config
            let category = command.category;
            if(category === "b_info") {category = "Информация"}
            else if (category === "a_moderation") {
              category = "Модерация"
            }
            else if (category === "e_fun") {
              category = "Фан"
            }
            else if (category === "g_vip") {
              category = "VIP"
            }
            else if (category === "h_roleplay") {
              category = "Ролевая Игра(RPG)"
            }
            else if (category === "d_reaction") {
              category = "Реакционные"
            }
            else if (category === "c_economy") {
              category = "Экономика"
            }
            else if (category === "f_settings") {
              category = "Настройки"
            }
            embed.setDescription(stripIndents`**Мой глобальный префикс: \`${PREFIX}\`**
            **Мой префикс на этом сервере: \`${prefix}\`**\n
            ** Команда: ** \`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\`
            ** Описание:** \`${command.description || "Нет описания."}\`
            **Категория:** \`${category}\`
            ** Применение: ** ${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : "\`Нет применения.\`"}
            ** Доступен для: ** \`${command.accessableby || "Для всех"}\`
            ** Псевдонимы: ** \`${command.aliases ? command.aliases.join(", ") : "Нету."}\``)
            embed.setFooter(message.guild.name, message.guild.iconURL())

            return message.channel.send({embeds: [embed]})
        }
    }
};
