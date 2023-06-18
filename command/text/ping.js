const Discord = require('discord.js')
const { Message, Client } = require('discord.js');

module.exports = {
    name: "ping",
    description: "Check Ping",

    /**
    *
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */

    async run (client, message, args) {
        const ping = new Discord.EmbedBuilder()
        .setTitle('**🏓 PING PONG! 🏓**')
        .setColor("Random")
        .addFields(
            {
                name: "🏓 Bot Latency",
                value: `${Date.now() - message.createdTimestamp}ms`,
                inline: true,
            },
            {
                name: "☎️ API Latency",
                value: `${Math.round(client.ws.ping)}ms`,
                inline: true,
            }
        )
        .setTimestamp()   
        message.reply({embeds : [ping]});
    }
}