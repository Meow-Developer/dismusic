module.exports = async (client, message, args) => {
	const queue = await client.queues.get(message.guild.id);
	if (!queue) return message.channel.send('Não estou tocando música aqui!');
	if (message.member.voice.channel !== message.guild.me.voice.channel)
		return message.channel.send(
			`Entre no canal onde eu (${
				message.client.user
			}) estou conectado para poder usar esse comando!`
		);
	queue.dispatcher.pause();
	message.channel.send('A playlist foi pausada!');
};
