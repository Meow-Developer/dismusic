module.exports = async (client, message, args) => {
	const queue = await client.queues.get(message.guild.id);
	if (!queue) return message.channel.send('Não estou tocando música aqui!');
	let num = 0;
	let pagina = 1;
	let totalPages = parseInt(queue.songs.length / 10 + 1);
	message.channel
		.send(
			`Playlist:\n${queue.songs
				.map((song, index) => `\`${index + 1} - ${song.title}\``)
				.slice(0, 10)
				.join('\n')}`
		)
		.then(async list => {
			if (queue.songs.length > 10) {
				const reactions = {
					'⬅'() {
						if (pagina !== 1) {
							num = num - 10;
							num =
								num.toString().length > 1
									? num -
									  parseInt(num.toString().slice(num.toString().length - 1))
									: 0;
							pagina -= 1;
						} else {
							pagina = totalPages;
							num = totalPages * 10 - 20;
						}
					},
					'➡'() {
						if (pagina !== totalPages) {
							num =
								num.toString().length > 1
									? num -
									  parseInt(num.toString().slice(num.toString().length - 1))
									: 0;
							num = num + 10;
							pagina += 1;
						} else {
							pagina = 1;
							num = 0;
						}
					}
				};
				const emojis = Object.keys(reactions);
				for (const emoji of emojis) {
					await list.react(emoji);
				}
				const collector = list.createReactionCollector(
					(reaction, user) =>
						user.id === message.author.id &&
						emojis.includes(reaction.emoji.name)
				);
				const edit = () => {
					list.edit(
						`Playlist:\n${queue.songs
							.map((song, index) => `\`${index + 1} - ${song.title}\``)
							.slice(pagina * 10 - 10, pagina * 10)
							.join('\n')}`
					);
				};
				collector.on('collect', reaction => {
					reactions[reaction.emoji.name]();
					edit();
					reaction.users.remove(message.author);
				});
			}
		});
};
