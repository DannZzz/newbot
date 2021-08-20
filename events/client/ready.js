const { PREFIX } = require('../../config');
module.exports = async bot => {
    console.log(`${bot.user.username} is available now!`)

    // let totalUsers = bot.guilds.cache.reduce((acc, value) => acc + value.memberCount, 0)
    // //var activities = [ `${bot.guilds.cache.size} сервера!`, `${totalUsers} участников!` ], i = 0;
    // var activities = ['Dann#0006', 'Only Chill'], i = 0
    // setInterval(() =>  bot.user.setActivity(`${PREFIX}хелп | ${activities[i++ % activities.length]}`, { type: "WATCHING" }),20000)
    bot.user.setActivity(`?changelog | ?help`)
};
