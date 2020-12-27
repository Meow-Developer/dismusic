module.exports = async (client, message, args) => {
	const queue = await client.queues.get(message.guild.id);
	if (!queue) return message.channel.send('Não estou tocando música aqui!');
	var song = queue.songs[0];
	message.channel.send({
		embed: {
			title: 'Tocando agora:',
			description: `[${song.title}](${song.url})`,
			thumbnail: { url: song.thumbnail },
			color: 0xffffff
		}
	});
};
