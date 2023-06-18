//? Preparing Package
require("dotenv").config();
const fs = require('fs');
const colors = require("colors");
const { join } = require('path');
const Discord = require('discord.js');

console.log(colors.bold(colors.cyan('Preparing and Running...')));

//? Preparing Discord Thing
const { ActivityType, ChannelType } = require('discord.js')
const { Routes } = require("discord-api-types/v9")
const { REST } = require("@discordjs/rest")
const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
const client = new Discord.Client({intents: ["Guilds", "GuildMessages", "GuildMessageReactions", "GuildVoiceStates", "MessageContent"]});
module.exports = client;

//? Log Configuration (https://www.npmjs.com/package/log-timestamp)
require("log-timestamp")(function () {
	return (`[${new Date().toLocaleString(`en-GB`, { timeZone: "Asia/Ho_Chi_Minh" })}]`); 
});

//? Get Data from Configuration File
const config = JSON.parse(fs.readFileSync("config.json")); //Get data from config.json
const prefix = config.prefix; //Bot Prefix (Text Command)

//? Variable Configuration
const TextCommand = { //Variable that has information of Text Command
    folderPath: config.source.textCommand.path,
    files: fs.readdirSync(join(__dirname, config.source.textCommand.path)).filter(file => file.endsWith(".js")),
    count: fs.readdirSync(config.source.textCommand.path).length,
    collection: new Discord.Collection(),
    loaded: new Array()
}
const SlashCommand = { //Variable that has information of Slash Command
    folderPath: config.source.slashCommand.path,
    files: fs.readdirSync(join(__dirname, config.source.slashCommand.path)).filter(file => file.endsWith(".js")),
    count: fs.readdirSync(config.source.slashCommand.path).length,
    collection: new Discord.Collection(),
    loaded: new Array()
}

//? Loading Command
    //?Text Command
    if (config.source.textCommand.enabled) {
    console.log(colors.bold(colors.yellow(`Starting load Text Commands...`)))
    for (const file of TextCommand.files) {
        const command = require(join(__dirname, TextCommand.folderPath, `${file}`));
        try {
            TextCommand.collection.set(command.name, command);
            TextCommand.loaded.push(command);
            console.log(colors.yellow(`[Text] `) + colors.green(`[${TextCommand.loaded.length}/${TextCommand.count}] Loaded ${file}`));
        } catch {
            console.log(colors.yellow(`[Text] `) + colors.red(`[${TextCommand.loaded.length}/${TextCommand.count}] Unloaded ${file}`));
        }
    }
    if (TextCommand.loaded.length === TextCommand.count) 
        console.log(colors.bold(colors.green(`Load Text Commands Successfully! (${TextCommand.loaded.length}/${TextCommand.count})`)))
    else console.log(colors.bold(colors.red(`Load Text Commands Failed! (${TextCommand.loaded.length}/${TextCommand.count}, ${TextCommand.count - TextCommand.loaded.length} failed)`)))
    } else {
        console.log(colors.bold(colors.yellow(`Text Commands disabled!`)))
    }

    //?Slash Command
    if (config.source.textCommand.enabled) {
        console.log(colors.bold(colors.yellow(`Starting load Slash Commands...`)))
        for (const file of SlashCommand.files) {
            const command = require(join(__dirname, SlashCommand.folderPath, `${file}`));
            try {
                SlashCommand.collection.set(command.name, command);
                SlashCommand.loaded.push(command);
                console.log(colors.yellow(`[Slash] `) + colors.green(`[${SlashCommand.loaded.length}/${SlashCommand.count}] Loaded ${file}`));
            } catch {
                console.log(colors.yellow(`[Slash] `) + colors.red(`[${SlashCommand.loaded.length}/${SlashCommand.count}] Unloaded ${file}`));
            }
        }
        (async () => { //Upload Slash Command to Discord Server
            try {
                await rest.put(
                        Routes.applicationCommands(process.env.clientID),
                        { body: SlashCommand.loaded }
                    )
                console.log(colors.bold(colors.green(`Load Slash Commands Successfully!`)))
            } catch (error) {
                console.error(colors.red(error))
                console.log(colors.bold(colors.red(`Load all Slash Commands Failed!`)))
            }
        })();
    } else {
        console.log(colors.bold(colors.yellow(`Slash Commands disabled!`)))
    }

//? Event Configuration
process.on('uncaughtException', function (err) {
    console.log(colors.red(err));
});
client.on("error", console.error);
client.on("messageCreate", async (message) => {
    if (message.author.bot) return; // If the message author is Bot
    if (message.channel.type === ChannelType.DM) return; // If the message was sent from DM
    if (message.content.startsWith(prefix)) { // If the message starts with prefix
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        
        if (!TextCommand.collection.has(command)) return;
        try {
            TextCommand.collection.get(command).run(client, message, args);
        } catch (error) { 
            console.error(colors.red(error));
            message.reply({content: "Something were wrong!"});
        }
    }
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.guild) return; // If the interaction is not sent from any Server (Guild)
    if (interaction.isCommand() || interaction.isContextMenuCommand()) { // If the interaction is Command or Context Menu Command
        const command = SlashCommand.collection.get(interaction.commandName);
        try {
            console.log(colors.white(`[Slash]   ${interaction.user.id}: /${interaction.commandName} ${JSON.stringify(interaction.options.data)}`))
            command.run(client, interaction, interaction.options.data);
        } catch (error) {
            console.error(colors.red(error))
            await interaction.reply({ content: "Something were wrong!", ephemeral: true })
        }
    }
})
client.on('ready', () => {
    //Set Activity for Bot: https://old.discordjs.dev/#/docs/discord.js/main/class/ClientUser?scrollTo=setActivity
    client.user.setActivity(`everyone`, {type: ActivityType.Listening})

    console.log(colors.bold(colors.green(`Logged in as ${client.user.tag}!`)));
    console.log(colors.green(`Bot is Online!`));
    console.log(`Currently on ${client.guilds.cache.size} server(s), has ${TextCommand.loaded.length} Text Command(s) and ${SlashCommand.loaded.length} Slash Commands`);
    console.log('=========================================================================================================');
});

//? Log into bot
console.log(colors.bold(colors.cyan('Logging in...')));
client.login(process.env.TOKEN).then((token) => {
    client.user.setPresence({
        status: 'online',
    });
});

