module.exports = async (client, message, args) => {
	if (!message.member.hasPermission('ADMINISTRATOR'))
		return message.channel.send(
			'Você não tem permissão de administrador para alterar o volume da música!'
		);
	const queue = await client.queues.get(message.guild.id);
	if (!queue) return message.channel.send('Não estou tocando música aqui!');
	if (message.member.voice.channel !== message.guild.me.voice.channel)
		return message.channel.send(
			`Entre no canal onde eu (${
				message.client.user
			}) estou conectado para poder usar esse comando!`
		);
	if (!args[0])
		return message.channel.send(`O volume atual é: \`${queue.volume}\`!`);
	if (isNaN(args[0]))
		return message.channel.send('Use apenas valores numéricos!');
	if (args[0] > 200)
		return message.channel.send('Eu só suporto volumes de `0` há `200`!');
	queue.volume = args[0];
	queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
	message.channel.send(`O volume setado é: \`${queue.volume}\`!`);
};
