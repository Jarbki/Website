require('dotenv').config();

const { Client, Collection, Events, GatewayIntentBits, MessageFlags,  } = require('discord.js');
const client = new Client({ intents: [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildVoiceStates, 
	GatewayIntentBits.GuildMembers
] });

const fs = require('node:fs');
const path = require('node:path');

client.cooldowns = new Collection();
client.commands = new Collection();
client.recordingSessions = new Map();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

console.log('Token from .env:', process.env.DISCORD_TOKEN);
client.login(process.env.DISCORD_TOKEN);

// const { Client, Events, GateWayIntentsBits, IntentsBitField } = require('discord.js');
// const listCommand = require('./commands/list');
// const recordCommand = require('./commands/record');
// const soundCommand = require('./commands/sound');

// const client = new Client({
//     intents: [
//         IntentsBitField.Flags.Guilds,
//         IntentsBitField.Flags.GuildMembers,
//         IntentsBitField.Flags.GuildMessages,
//         IntentsBitField.Flags.MessageContent,
//         IntentsBitField.Flags.DirectMessageReactions,
//         IntentsBitField.Flags.GuildMessageReactions
//     ]
// })

// client.on('ready',(c) => {
//     console.log(`Bot connected✅: \nTag: ${c.user.tag} \nid: ${c.user.id} `)
// });

// client.login(process.env.DISCORD_TOKEN);

// client.on('messageCreate', (msg) =>{
//     var command = processMessage(msg);

//     if (msg.author.bot) return;
    
//     if (msg[0]=='!'){
//         handleCommand(msg);
//         console.log(`Message sent by user ${msg.author.globalName} was a command: ${msg.content}`)
//     } else {
//         console.log(`Message sent by user ${msg.author.globalName} was not a command: ${msg.content}`)
//     }
    
// });


// function handleCommand(msg) {
//     var command = msg.content.slice(1).split(" ")[0];
//     var commandContent = msg.content.slice(1).split(" ")[1];
//     switch (command) {
//         case "list":
//             // handle !list
//             msg.reply("You triggered the list command!");
//             listCommand(commandContent);
//             break;

//         case "record":
//             // handle !record
//             msg.reply("You triggered the record command!");
//             recordCommand()
//             break;

//         case "sound":
//             // handle !sound
//             msg.reply("You triggered the sound command!");
//             soundCommand(commandContent)
//             break;

//         default:
//             msg.reply(`Unknown command: ${command}`);
//     }
// }


