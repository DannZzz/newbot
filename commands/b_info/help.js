const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const serverModel = require("../../models/serverSchema")
const { stripIndents } = require("common-tags");
const { cyan } = require("../../JSON/colours.json");
const { PREFIX, DISAGREE } = require('../../config');

module.exports = {
    config: {
        name: "хелп",
        aliases: ["х", 'help', "помощь"],
        usage: "[команда] (по желанию)",
        category: "b_info",
        description: "Выдает все доступные команды",
        accessableby: "Для всех"
    },
    run: async (bot, message, args) => {
        let prefix;
        let serverData = await serverModel.findOne({ serverID: message.guild.id });
        if(!serverData) {
          let server = await serverModel.create({
            serverID: message.guild.id,
          })
        server.save()}

        prefix = serverData.prefix;

        const embed = new MessageEmbed()
            .setColor(cyan)
            .setAuthor(`${message.guild.me.displayName} | Хелп`, message.guild.iconURL())
            .setThumbnail(bot.user.displayAvatarURL())

        if (!args[0]) {


            const categories = readdirSync("./commands/")

            embed.setDescription(`**Все доступные команды! ${message.guild.me.displayName}\nПрефикс бота по умолчанию: \`${PREFIX}\`\nПрефикс для этого сервера: \`${prefix}\`\n\ Еще больше информации: \n\`${prefix}хелп [команда | псевдоним]\`**`)
            embed.setFooter(`${message.guild.me.displayName} | Кол-во команд: ${bot.commands.size-1} `, bot.user.displayAvatarURL());

            categories.forEach(category => {
                const dir = bot.commands.filter(c => c.config.category === category);
                if(category === "b_info") {category = "Информация"}
                else if (category === "a_moderation") {
                  category = "Модерация"
                }
                else if (category === "owner") {
                  category = "Для разработчика"
                }
                else if (category === "g_vip") {
                  category = "VIP"
                }
                else if (category === "e_fun") {
                  category = "Фан"
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
                const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);
                try {
                    embed.addField(`${capitalise} [${dir.size}]: `, dir.map(c => `\`${c.config.name}\``).join(", "))

                } catch (e) {
                    console.log(e)
                }
            })

            return message.channel.send(embed)
        } else {
            let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
            if (!command) return message.channel.send(embed.setTitle(`${DISAGREE} **Не правильная команда!**`).setDescription(`**Пишите \`${prefix}хелп\` чтобы посмотреть все доступные команды бота!**`))
            command = command.config
            let category = command.category;
            if(category === "b_info") {category = "Информация"}
            else if (category === "a_moderation") {
              category = "Модерация"
            }
            else if (category === "owner") {
              category = "Для разработчика"
            }
            else if (category === "e_fun") {
              category = "Фан"
            }
            else if (category === "g_vip") {
              category = "VIP"
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
            embed.setDescription(stripIndents`**Префикс бота по умолчанию: \`${PREFIX}\`**
            **Префикс для этого сервера: \`${prefix}\`**\n
            ** Команда: ** \`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\`
            ** Описание:** \`${command.description || "Нет описания."}\`
            **Категория:** \`${category}\`
            ** Применение: ** ${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : "\`Нет применения.\`"}
            ** Доступен для: ** \`${command.accessableby || "Для всех"}\`
            ** Псевдонимы: ** \`${command.aliases ? command.aliases.join(", ") : "Нету."}\``)
            embed.setFooter(message.guild.name, message.guild.iconURL())

            return message.channel.send(embed)
        }
    }
};
