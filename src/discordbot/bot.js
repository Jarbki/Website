const { Client, IntentsBitField } = require('discord.js');
require('dotenv').config();
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
})

client.on('ready',(c) => {
    console.log(`Bot connected✅: \nTag: ${c.user.tag} \nid: ${c.user.id} `)
});

client.on('messageCreate', (msg) =>{
    var command = processMessage(msg);
    if (command){
        console.log(`Message sent by user ${msg.author.globalName} was a command: ${msg.content}`)
    } else {
        console.log(`Message sent by user ${msg.author.globalName} was not a command: ${msg.content}`)
    }
    
});


client.login(process.env.DISCORD_TOKEN);

function processMessage(msg){
    var message = msg.content;
    var command = false;
    if (msg[0] === '/'){
        command = true;
    }

    return command;
}