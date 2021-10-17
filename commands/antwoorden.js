const cm = require("../cm.js");
const ans = require("./data/antwoorden.js");
const command = async function (args, msg){
	if(msg && args[0] && ans[args[0]]) msg.channel.send(ans[args[0]]);
	else msg.channel.send(cm('Help', ans._help));
};
module.exports = {
	hasInit: false,
	command,
	iAmAValidCommand: true
};
