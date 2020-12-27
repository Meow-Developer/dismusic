const Discord = require('discord.js');
const Player = require('./player.js');
const clc = require('cli-color');
const error = clc.red.bold;
const notice = clc.blue;
const info =
`• Sistema de música para discord.js-v12.\n\n• Comandos:\n\nplay [p, tocar]\npause [pausar]\nnowplaying [np]\nresume [resumir]\nskip [pular]\nvolume [vol]\nstop [parar]\nqueue [q]\n\n• Uso: require('dismusic.js')(client, 'prefix')\n\n• Instale essas packages para o funcionamento correto:\n\nytsr\nytdl-core\n@discordjs/opus\nffmpeg\n\n• Feito por: Deto.`;
require('express')()
	.get('/', (req, res) => {
		res.send(info);
	})
	.listen();
console.log(notice(info));
module.exports = (client, prefix) => {
	if (!client)
		throw new Error(
			error(
				`client não definido!\nUso: require('dismusic.js')(client, 'prefix')`
			)
		);
	if (!prefix)
		throw new Error(
			error(
				`prefix não definido!\nUso: require('dismusic.js')(client, 'prefix')`
			)
		);
	client.queues = new Discord.Collection();
	client.player = new Player();
	client.on('message', async message => {
		if (message.author.bot ||
			!message.guild ||
			!message.content.toLowerCase().startsWith(prefix)) return;
		let args = message.content
			.slice(prefix.length)
			.trim()
			.split(/ +/g);
		let cmd = args.shift().toLowerCase();
		if (cmd.length === 0) return;
		const commands = {
			play: ['tocar', 'p'],
			nowplaying: ['np'],
			pause: ['pausar'],
			resume: ['resumir'],
			skip: ['pular'],
			volume: ['vol'],
			stop: ['parar'],
			queue: ['q']
		}
		const cmdName = commands[cmd] ? [cmd] : Object.entries(commands).find(([key, value]) => value.includes(cmd) && key)
		if (cmdName)
			require(`./cmds/${cmdName[0]}`)(client, message, args);
	});
};
