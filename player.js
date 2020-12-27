const ytdl = require('ytdl-core');
require('@discordjs/opus');
require('ffmpeg');
class player {
	constructor() {}
	async system(client, message, song, msg) {
		var queue = await client.queues.get(message.guild.id);
		if (!song) {
			if (queue) {
				message.channel.send('A música acabou...');
				await queue.connection.disconnect();
				return client.queues.delete(message.member.guild.id);
			}
		}
		if (!queue) {
			var conn = await message.member.voice.channel.join();
			queue = {
				volume: 50,
				connection: conn,
				dispatcher: null,
				songs: [song]
			};
			client.queues.set(message.guild.id, queue);
		}
		queue.dispatcher = await queue.connection.play(
			await ytdl(song.url, {
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
				.then(xyz => {
					queue.dispatcher.on('finish', async () => {
						xyz && xyz.delete();
						await queue.songs.shift();
						client.player.system(client, message, queue.songs[0]);
					});
					queue.connection.on('disconnect', () => {
						xyz && xyz.delete();
						client.queues.delete(message.member.guild.id);
					});
				}),
			msg && msg.delete()
		);
	}
}
module.exports = player;
