require('dotenv').config();

const { Client, IntentsBitField } = require('discord.js');
const listCommand = require('./commands/list');
const recordCommand = require('./commands/record');
const soundCommand = require('./commands/sound');
const { record, stop } = require('./commands/record');

client.login(process.env.DISCORD_TOKEN);
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessageReactions,
        IntentsBitField.Flags.GuildMessageReactions
    ]
})

client.on('ready',(c) => {
    console.log(`Bot connected✅: \nTag: ${c.user.tag} \nid: ${c.user.id} `)
});

client.on('messageCreate', (msg) =>{
    var command = processMessage(msg);

    if (msg.author.bot) return;
    
    if (msg[0]=='!'){
        handleCommand(msg);
        console.log(`Message sent by user ${msg.author.globalName} was a command: ${msg.content}`)
    } else {
        console.log(`Message sent by user ${msg.author.globalName} was not a command: ${msg.content}`)
    }
    
});


function handleCommand(msg) {
    var command = msg.content.slice(1).split(" ")[0];
    switch (command) {
        case "list":
            // handle !list
            msg.reply("You triggered the list command!");
            listCommand(msg);
            break;

        case "record":
            // handle !record
            msg.reply("You triggered the record command!");
            record()
            break;

        case "stop record":
            stop()
            break;

        case "sound":
            // handle !sound
            msg.reply("You triggered the sound command!");
            
            break;

        default:
            msg.reply(`Unknown command: ${command}`);
    }
}