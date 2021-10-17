const help = require("./data/help.js");
const command = async function (args, msg){
	msg.channel.send(help._help);
};
module.exports = {
	hasInit: false,
	command,
	iAmAValidCommand: true
};
