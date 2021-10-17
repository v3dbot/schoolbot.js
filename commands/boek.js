const cm = require("../cm.js");
const boek = require("./data/boek.js");
const command = async function (args, msg){
	if(msg && args[0] && boek[args[0]]) msg.channel.send(cm(boek[args[0]].name, boek[args[0]].text));
	else msg.channel.send(cm('Help', boek._help));
};
module.exports = {
	hasInit: false,
	command,
	iAmAValidCommand: true
};
