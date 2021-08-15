const respGlob = ['global', 'g', 'глобал', 'г'];
const respServ = ["server", 's', 'сервер', 'с'];
const {MessageEmbed} = require("discord.js");
const sd = require('../../models/serverSchema.js')
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const ms = require('ms');
const embed = require('../../embedConstructor');
const {error} = require('../../functions');

module.exports = {
  config: {
    name: "магазин",
    description: "Посмотреть доступные магазины.",
    category: "c_economy",
    aliases: ["shop", "store", "магаз", 'шоп'],
    accessableby: "Для всех",
    usage: "(сервер | глобал)"
  },
  run: async (bot, message, args) => {
    const resp = args[0]
    if (respGlob.includes(resp)) {
      let embed = new MessageEmbed()
      .setColor(cyan)
      .setAuthor("Вся информация о переводах: ?donate")
      .addFields(
        {name: `<a:vip1:867868958877810748> VIP 1`,
        value: `Увеличивает ставку для всех игр(до 1.000.000), доступ к командам - эмбед, канал, уровни(включение системы уровней), эскиз и био профиля, и так же увеличивает стоимость рыб(на 33%).`,
        inline: false},
        {name: `<a:vip2:867868958459166751> VIP 2`,
        value: `Даёт доступ к уникальным героям, уменьшает **cooldown** для всех команд **два** раза, даёт возможность оформить ранг-карточку, картинку профиля, а так же убирает ограничение ставок для всех игр.`,
        inline: false},
        {name: `Цены в рублях.`,
        value: `• Vip 1 + 100 ${STAR} - 30₽\n• Vip 2 + 200 ${STAR} - 100₽\n• Герой **Zeus (Зевс)** - 200₽`,
        inline: false},
      )
      .setTimestamp()
      .setFooter("Отправьте ваши вопросы командой ?сообщение")

      return message.channel.send(embed)
    } else if (respServ.includes(resp)) {
      const server = message.guild
      const data = await sd.findOne({serverID: server.id})

      if (data.shop.length < 1) return error(message, `Тут ничего нет.`);

      let shopEmb = new MessageEmbed()
      .setColor(cyan)
      .setTimestamp()
      .setTitle(`Магазин сервера — ${server.name}`)

      data.shop.forEach((item, i) => {
        return shopEmb.addField(`\`\`${i + 1}\`\` Название: **${item.Name}**`, `**Цена:** ${item.Cost ? `\`\`${new Intl.NumberFormat('de-DE').format(item.Cost)}\`\`${COIN}` : "\`\`Отсуствует\`\`"}\n**Роль:** ${server.roles.cache.get(item.Role) ? `<@&${item.Role}>` : `\`\`Отсуствует\`\``}\n**Описание:** \`\`${item.Description ? item.Description : 'Отсуствует'}\`\``, false)
      });

      return message.channel.send(shopEmb)


    } else {
      const server = message.guild
      const data = await sd.findOne({serverID: server.id})
      return embed(message).setPrimary(`
**Оооо, пора выбрать магазин**

**Глобальный магазин**
\`\`${data.prefix}магазин глобал\`\`
\`\`\`
Вещи, которые можно тащить с собой куда угодно.
\`\`\`
**Магазин сервера**
\`\`${data.prefix}магазин сервер\`\`
\`\`\`
Можешь купить себе роли, на этом сервер.\`\`\``).send()

    }


  }
}
