const { joinVoiceChannel, getVoiceConnection, EndBehaviorType } = require('@discordjs/voice');
const { createWriteStream } = require('fs');
const { pipeline } = require('stream');
const prism = require('prism-media');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');

let recordingStreams = new Map(); // Store ongoing streams by userId

function record(msg) {
  const voiceChannel = msg.member?.voice?.channel;
  if (!voiceChannel) {
    msg.reply("Join a voice channel first.");
    return;
  }

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator
  });

  connection.receiver.speaking.on('start', (userId) => {
    if (recordingStreams.has(userId)) return; // already recording

    const audioStream = connection.receiver.subscribe(userId, {
      end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: 1000
      }
    });

    const rawStream = new prism.opus.Decoder({ frameSize: 960, channels: 2, rate: 48000 });

    const fileName = `recordings/${userId}-${Date.now()}.mp3`;
    const outputPath = path.resolve(__dirname, '..', fileName);

    const ffmpegProcess = ffmpeg()
      .input(audioStream.pipe(rawStream))
      .inputFormat('s16le')
      .audioCodec('libmp3lame')
      .format('mp3')
      .save(outputPath)
      .on('end', () => {
        console.log(`Saved recording to ${outputPath}`);
        recordingStreams.delete(userId);
      })
      .on('error', err => {
        console.error('Recording error:', err);
        recordingStreams.delete(userId);
      });

    recordingStreams.set(userId, ffmpegProcess);
    msg.reply(`🔴 Started recording <@${userId}>`);
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

module.exports = { record, stop };


function play(name){

}

function echo(filter){
    
}

module.exports = record;
module.exports = stop;