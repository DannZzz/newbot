const { MessageEmbed, MessageButton } = require("discord.js");
const { cyan } = require("../../JSON/colours.json");
const heroes = require("../../JSON/heroes.json");
const enemies = require("../../JSON/enemies.json");
const {error, pagination} = require('../../functions');
const { VERSION, STAR } = require('../../config');

module.exports = {
    config: {
        name: "журнал",
        description: "Журнал изменений бота.",
        usage: "",
        category: "b_info",
        accessableby: "Для всех",
        aliases: ['changelog']
    },
    run: async (bot, message, args) => {
        try {
   
          const page1 = new MessageEmbed()
          .setAuthor('Последние изменения бота.')
          .setTitle(`Большое обновление!\nВерсия: ${VERSION}`)
          .setColor(cyan)
          .setDescription(`Новые герои, враг, баффы, нерфы, и команды!`)
          .setImage("https://i.ibb.co/DphLFw5/image.png")

          const page2 = new MessageEmbed()
          .setAuthor(`Новые герои!`)
          .addField(`Eragon (Эрагон)`, heroes["Eragon"].description ,false)
          .addField(`Ariel (Ариэль)`, heroes["Ariel"].description ,false)
          .setImage("https://i.ibb.co/XLq9gQQ/ariel-eragon.gif")
          .setColor(cyan)

          const page3 = new MessageEmbed()
          .setAuthor(`Новый враг D'Wolf (Д'Волк)`)
          .setDescription(enemies["D'Wolf"].description)
          .setImage(enemies["D'Wolf"].url)
          .setColor(cyan)

          const page4 = new MessageEmbed()
          .setAuthor(`Общие изменения`)
          .setDescription(`Новые команды \`\`заменить, мои, журнал(эта)\`\`\n\nБыла убрана категория команд __Модерация__, а так же много команд в категории __Настройки__\n\nТеперь можно иметь 2 героя!\n\`\`?купить место\`\`\nСтоимость 2000 ${STAR}\n\nИзменение команды \`\`викторина\`\` выигрыш было 1 --> 3 ${STAR}\n\nТеперь можно купить звёзды за денег!\nДля информации: \`\`?магазин глобал\`\``)
          .addField(`Нерф Д'Лорда`, '🔴 Жизнь __1000__ * уровень приключений --> __800__ * уровень приключений\n🔴 Атака __70__ * уровень приключений --> __50__ * уровень приключений')
          .addField(`Нерф Артаса`, '🔴 Жизнь __700__ * уровень приключений --> __500__ * уровень приключений\n🔴 Атака __50__ * уровень приключений --> __40__ * уровень приключений')
          .addField(`Изменение Селены`, 'Теперь она доступна не только для __VIP 2__ участников.')
          .setColor(cyan)

          const timeout = '100000'
          const userids = [message.author.id]
          const pages = [page1, page2, page3, page4]
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
          pagination(message, pages, buttonList, timeout, userids)
      
          
        }
        catch (r ){
            console.log(r);
        }
    }
}

