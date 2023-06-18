const Discord = require('discord.js')

module.exports = {
    name: "ping",
    description: "Check Ping",

    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    * @param {Object[]} option { name: 'id', type: 'INTEGER', value: 69 }
    */

    async run (client, interaction, option) {
        const ping = new Discord.EmbedBuilder()
            .setTitle('**🏓 PING PONG! 🏓**')
            .setColor("Random")
            .addFields(
                {
					name: "🏓 Bot Latency",
					value: `${Date.now() - interaction.createdTimestamp}ms`,
					inline: true,
				},
				{
					name: "☎️ API Latency",
					value: `${Math.round(client.ws.ping)}ms`,
					inline: true,
				}
            )
            .setTimestamp()   
        interaction.reply({embeds : [ping], ephemeral: true});
    }
}