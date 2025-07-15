
const { joinVoiceChannel, getVoiceConnection, EndBehaviorType } = require('@discordjs/voice');
const { createWriteStream } = require('fs');
const { pipeline } = require('stream');
const prism = require('prism-media');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const { request } = require('undici');


const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('record')
		.setDescription('Records voice audio from a channel')
    .addStringOption(option => 
      option.setName("input")
      .setDescription("Name of recording")
      .setRequired(true)
    ),

	async execute(interaction) {
    const voiceChannel = interaction.member?.voice?.channel;
    const recordingSessions = interaction.client.recordingSessions;

    console.log(voiceChannel);
    if (!voiceChannel) {
      await interaction.reply("Join a voice channel first bruh.");
      return;
    }

    if (recordingSessions.has(voiceChannel)) {
      interaction.reply("This channel is already being recorded");
      return;
    }

		await interaction.reply(`Recording voices in ${voiceChannel}!`);
    await record(interaction, voiceChannel, recordingSessions)

	},
};



// record function
async function record(interaction, voiceChannel, recordSessions) {

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator
  });

  // listen for speaking events
  connection.receiver.speaking.on('start', (userId) => {
    if (recordSessions.has(userId)) return; // already recording

    // subscribe to user audio
    const audioStream = connection.receiver.subscribe(userId, {
      end: {behavior: EndBehaviorType.Manual}
    });




    // used to decode from OPUS to raw PCM.
    const rawStream = new prism.opus.Decoder({ frameSize: 960, channels: 2, rate: 48000 });

    const fileName = `recordings/${userId}-${Date.now()}.mp3`;
    const outputPath = path.resolve(__dirname, '..', fileName);

    // convert to 
    const ffmpegProcess = ffmpeg()
        .input(audioStream.pipe(rawStream)) // pipe raw audio to ffmpeg
        .inputFormat('s16le')               // PCM format
        .audioCodec('libmp3lame')           // encode as mp3
        .format('mp3')                      // output format
        .save(outputPath)                   // where to save
        .on('end', () => {
            console.log(`Saved recording to ${outputPath}`);
            recordingStreams.delete(userId);
        })
        .on('error', err => {
            console.error('Recording error:', err);
            recordingStreams.delete(userId);
        });

    recordingStreams.set(userId, ffmpegProcess);
        
  });
}













function stop(msg) {
    const userId = msg.author.id;

    const process = recordingStreams.get(userId);
    if (!process) {
        msg.reply("You're not being recorded.");
        return;
    }

    process.kill('SIGINT'); // Ends ffmpeg process
    msg.reply("🛑 Recording stopped.");
}

// function to play a saved sound
function play(name){

}

// function to echo back the sounds by the bot
function echo(filter){
    
}
