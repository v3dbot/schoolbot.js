const playlist = require("./data/playlist.js");
const cm = require("../cm.js");
const command = async function (args, msg){
	if(msg && args[0] && playlist[args[0]]) msg.channel.send(playlist[args[0]]);
	else msg.channel.send(cm('help', playlist._help));
};
module.exports = {
	hasInit: false,
	command,
	iAmAValidCommand: true
};
