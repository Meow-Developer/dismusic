const ytdl = require('ytdl-core');
module.exports = class Player {
	async system(message, song) {
		let queue = await message.client.queues.get(message.guild.id);
		if (!song) {
			message.channel.send('A música acabou...');
			await queue.connection.disconnect();
			return message.client.queues.delete(message.member.guild.id);
		}
		if (!queue) {
			const conn = await message.member.voice.channel.join();
			queue = {
				volume: 50,
				connection: conn,
				dispatcher: null,
				songs: [song]
			};
			message.client.queues.set(message.member.guild.id, queue);
		}
		queue.dispatcher = await queue.connection.play(
			await ytdl(song.url, {
				highWaterMark: 1,
				type: 'opus',
				volume: queue.volume / 100,
				bitrate: 'auto'
			}),
			message.channel.send(`Tocando agora: \`${song.title}\``)
		);
		queue.dispatcher.on('finish', async () => {
			await queue.songs.shift();
			message.client.player.system(message, queue.songs[0]);
		});
		queue.connection.on('disconnect', async () => {
			queue.songs = [];
			await message.client.queues.set(message.guild.id, queue);
			queue.dispatcher.end();
		});
	}
};
