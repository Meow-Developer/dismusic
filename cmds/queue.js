module.exports = async (client, message, args) => {
	var queue = await client.queues.get(message.guild.id);
	if (!queue) return message.channel.send('Não estou tocando música aqui!');
	let num = 0;
	let pagina = 1;
	let totalPages = parseInt(queue.songs.length / 10 + 1);
	message.channel
		.send({
			embed: {
				title: 'Playlist:',
				description: `${queue.songs
					.map(
						(song, index) => `\`${index + 1}:\` [${song.title}](${song.url})`
					)
					.slice(0, 10)
					.join('\n')}`,
				color: 0xffffff
			}
		})
		.then(async list => {
			if (queue.songs.length > 10) {
				await list.react('⬅');
				await list.react('➡');
				let back = list.createReactionCollector(
					(reaction, user) =>
						reaction.emoji.name === '⬅' && user.id === message.author.id
				);
				let next = list.createReactionCollector(
					(reaction, user) =>
						reaction.emoji.name === '➡' && user.id === message.author.id
				);
				back.on('collect', async reaction => {
					if (pagina !== 1) {
						num = num - 10;
						num =
							num.toString().length > 1
								? num -
								  parseInt(num.toString().slice(num.toString().length - 1))
								: 0;
						pagina -= 1;
						list.edit({
							embed: {
								title: 'Playlist:',
								description: `${queue.songs
									.map(
										(song, index) =>
											`\`${index + 1}:\` [${song.title}](${song.url})`
									)
									.slice(pagina * 10 - 10, pagina * 10)
									.join('\n')}`,
								color: 0xffffff
							}
						});
						reaction.users.remove(message.author);
					} else {
						pagina = totalPages;
						num = totalPages * 10 - 20;
						list.edit({
							embed: {
								title: 'Playlist:',
								description: `${queue.songs
									.map(
										(song, index) =>
											`\`${index + 1}:\` [${song.title}](${song.url})`
									)
									.slice(totalPages * 10 - 10, pagina * 10)
									.join('\n')}`,
								color: 0xffffff
							}
						});
						reaction.users.remove(message.author);
					}
				});
				next.on('collect', async reaction => {
					if (pagina !== totalPages) {
						num =
							num.toString().length > 1
								? num -
								  parseInt(num.toString().slice(num.toString().length - 1))
								: 0;
						num = num + 10;
						pagina += 1;

						list.edit({
							embed: {
								title: 'Playlist:',
								description: `${queue.songs
									.map(
										(song, index) =>
											`\`${index + 1}:\` [${song.title}](${song.url})`
									)
									.slice(pagina * 10 - 10, pagina * 10)
									.join('\n')}`,
								color: 0xffffff
							}
						});
						reaction.users.remove(message.author);
					} else {
						pagina = 1;
						num = 0;
						list.edit({
							embed: {
								title: 'Playlist:',
								description: `${queue.songs
									.map(
										(song, index) =>
											`\`${index + 1}:\` [${song.title}](${song.url})`
									)
									.slice(0, pagina * 10)
									.join('\n')}`,
								color: 0xffffff
							}
						});
						reaction.users.remove(message.author);
					}
				});
			}
		});
};
