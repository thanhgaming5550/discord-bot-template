const Discord = require('discord.js')
const { Client, CommandInteraction } = require("discord.js");

module.exports = {
    name: "name", //Name of the command (/{name})
    description: "Description", //Description of the command
    options: [
        {
            name: "input",
            type: 4,
            description: "This is an INTERGER input",
            required: false,
        },
        // If you want to have subcommands in your command, you can refer here: https://github.com/thanhgaming5550/bot-thieu-nang/blob/v3/src/Commands/slash/anime.js
        // Here is The Document: https://old.discordjs.dev/#/docs/discord.js/main/typedef/ApplicationCommandOption
    ],

    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    * @param {Object[]} option { name: 'id', type: 'INTEGER', value: 69 }
    */

    async run (client, interaction, option) {
        
        // Do something here

    }
}