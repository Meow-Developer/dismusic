const Discord = require('discord.js');
const clc = require('cli-color');
var error = clc.red.bold;
var notice = clc.blue;
const info = `• Sistema de música para discord.js-v12.\n\n• Comandos:\n\nplay [p, tocar]\npause [pausar]\nnowplaying [np]\nresume [resumir]\nskip [pular]\nvolume [vol]\nstop [parar]\nqueue [q]\n\n• Uso: require('dismusic.js')(client, 'prefix')\n\n• Instale essas packages para o funcionamento correto:\n\nytsr\nytdl-core\n@discordjs/opus\nffmpeg\n\n• Feito por: Deto.`;
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
	const abc = require('./player.js');
	const xyz = new abc();
	client.player = xyz;
	client.on('message', async message => {
		if (message.author.bot) return;
		if (!message.guild) return;
		if (!message.content.toLowerCase().startsWith(prefix)) return;
		let args = message.content
			.slice(prefix.length)
			.trim()
			.split(/ +/g);
		let cmd = args.shift().toLowerCase();
		if (cmd.length === 0) return;
		if (cmd === 'play' || cmd === 'tocar' || cmd === 'p') {
			require('./cmds/play.js')(client, message, args);
		}
		if (cmd === 'nowplaying' || cmd === 'np') {
			require('./cmds/nowplaying.js')(client, message, args);
		}
		if (cmd === 'pause' || cmd === 'pausar') {
			require('./cmds/pause.js')(client, message, args);
		}
		if (cmd === 'resume' || cmd === 'resumir') {
			require('./cmds/resume.js')(client, message, args);
		}
		if (cmd === 'skip' || cmd === 'pular') {
			require('./cmds/skip.js')(client, message, args);
		}
		if (cmd === 'volume' || cmd === 'vol') {
			require('./cmds/volume.js')(client, message, args);
		}
		if (cmd === 'stop' || cmd === 'parar') {
			require('./cmds/stop.js')(client, message, args);
		}
		if (cmd === 'queue' || cmd === 'q') {
			require('./cmds/queue.js')(client, message, args);
		}
	});
};
