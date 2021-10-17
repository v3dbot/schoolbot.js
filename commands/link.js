const cm = require("../cm.js");
const links = require('./data/link.js');
const command = async function (args, msg){
	if(msg && args[0] && links[args[0]]) msg.channel.send(cm(links[args[0]].name, links[args[0]].text));
	else msg.channel.send(cm('Help', links._help));
};
module.exports = {
	hasInit: false,
	command,
	iAmAValidCommand: true
};
