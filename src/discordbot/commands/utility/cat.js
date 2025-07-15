const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');
module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('Random cat image'),
	async execute(interaction) {
        try {
            const catResult = await request('https://aws.random.cat/meow');
            const { file } = await catResult.body.json();
            interaction.editReply({ files: [file] });
        } catch (error) {
            console.log(error);
        }

	},
};