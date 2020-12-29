module.exports = async (client, message, args) => {
	const queue = await client.queues.get(message.guild.id);
	if (!queue) return message.channel.send('Não estou tocando música aqui!');
	var song = queue.songs[0];
	message.channel.send(`Tocando agora: \`${song.title}\``);
};
