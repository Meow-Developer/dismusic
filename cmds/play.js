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
	ytsr(args.join(' '), { safeSearch: true, limit: 1 }).then(async result => {
		if (!result.items[0])
			return message.channel.send('Não encontrei a música!');
		var song = {
			title: result.items[0].title,
			url: result.items[0].url
		};
		message.channel.send(`Música adicionada a playlist: \`${song.title}\``);
		if (queue) return queue.songs.push(song);
		client.player.system(message, song);
	});
};
