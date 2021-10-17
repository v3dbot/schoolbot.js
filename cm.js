const Discord = require('discord.js');
module.exports = function (t, m){
	const embed = new Discord.MessageEmbed()
	.setColor('#c5044c')
	.addFields(
		{ name: t, value: m }
	);
	return embed
}
