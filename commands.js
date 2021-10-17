const les = require("./commands/les_v2.js");
const playlist = require("./commands/playlist.js");
const boek = require("./commands/boek.js");
const help = require("./commands/help.js");
const antwoorden = require("./commands/antwoorden.js");
const link = require("./commands/link.js");
const malmberg = require("./commands/malmberg.js");

const inits = [
  les
]

const commands = {
  boek,
  link,
  "lnk": link,
  "ln": link,
  "meet": link,
  "standaardlink": link,
  antwoorden,
  "ant": antwoorden,
  "antw": antwoorden,
  "antwoord": antwoorden,
  "ml": malmberg,
  malmberg,
  help,
  "h": help,
  "?": help,
   playlist,
  "pl": playlist,
  les
}
const init = async function (callback) {
  inits.forEach((cmd, i) => {
    cmd.init();
  });
  callback();
};
const handler = async function (message) {
	if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;
	let args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
	const cmd = args.shift().toLowerCase();
	args.forEach((arg, i) => args[i] = arg.toLowerCase());

	//if (typeof(commands[cmd])=="function") commands[cmd](args, message);
	if (typeof(commands[cmd])=="object" && commands[cmd].iAmAValidCommand && Object.keys(commands).indexOf(cmd)!=-1) commands[cmd].command(args, message);
	else return;
}
module.exports = {handler, init};
