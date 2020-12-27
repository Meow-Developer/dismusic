const ytsr = require('ytsr');
module.exports = async (client, message, args) => {
	const queue = await client.queues.get(message.guild.id);
	const { channel } = message.member.voice;
	if (!channel)
		return message.channel.send(
			'Entre em um canal de voz para usar esse comando!'
		);
	if (queue && channel !== message.guild.me.voice.channel)
		return message.channel.send(
			`Entre no canal onde eu (${
				message.client.user
			}) estou conectado para poder usar esse comando!`
		);
	if (!args.length)
		return message.channel.send('Diga o nome ou link da música a ser tocada!');
	message.channel.send('Pesquisando...').then(abc => {
		ytsr(args.join(' '), { safeSearch: true, limit: 1 }).then(result => {
			const song = result.items[0];
			abc.delete();
			if (!song) return message.channel.send('Não encontrei a música!');
			message.channel.send({
				embed: {
					title: 'Música adicionada a playlist:',
					description: `[${song.title}](${song.url})`,
					thumbnail: { url: song.bestThumbnail.url || null },
					color: 0xffffff
				}
			});
			if (queue) {
				queue.songs.push(song);
			} else {
				message.channel
					.send('Criando player...')
					.then(msg => client.player.system(client, message, song, msg));
			}
		});
	});
};
