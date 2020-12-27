const ytdl = require('ytdl-core');
require('@discordjs/opus');
require('ffmpeg');
module.exports = class Player {
	async system(client, message, song, msg) {
		let queue = await client.queues.get(message.guild.id);
		if (!song) {
			if (queue) {
				message.channel.send('A música acabou...');
				await queue.connection.disconnect();
				return client.queues.delete(message.member.guild.id);
			}
		}
		if (!queue) {
			const conn = await message.member.voice.channel.join();
			queue = {
				volume: 50,
				connection: conn,
				dispatcher: null,
				songs: [song]
			};
			client.queues.set(message.guild.id, queue);
		}
		queue.dispatcher = await queue.connection.play(
			ytdl(song.url, {
				highWaterMark: 1,
				type: 'opus',
				volume: queue.volume / 100,
				bitrate: 'auto'
			}),
			message.channel
				.send({
					embed: {
						title: 'Tocando agora:',
						description: `[${song.title}](${song.url})`,
						thumbnail: { url: song.bestThumbnail.url || null },
						color: 0xffffff
					}
				})
				.then(playingMessage => {
					queue.dispatcher.on('finish', async () => {
						playingMessage.delete();
						await queue.songs.shift();
						client.player.system(client, message, queue.songs[0]);
					});
					queue.connection.on('disconnect', () => {
						playingMessage.delete();
						client.queues.delete(message.member.guild.id);
					});
				}),
			msg && msg.delete()
		);
	}
}
