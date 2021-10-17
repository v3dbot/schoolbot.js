const IcalExpander = require('ical-expander');
const fs = require('fs');
const Discord = require('discord.js');
const download = require('download');

// LESNU #########################################################################
class LesEvent extends Object{
	constructor(icEvent){
		super();
		this.properties = new Object();
		icEvent.component[1].forEach(property => {
			this.properties[property[0]] = {"value": property[3], "type": property[2]};
		});
	}
}


let lesData = "";
const amin = (dt, min) => {
	const o = new Date();
	o.setMinutes(dt.getMinutes() + min);
	return o;
}
const occurr = (a, b) => (a.match(b) || []).length;
const lesNu = (ics, preMins, postMins, e) => {
	e = e||"nu";
	const icalExpander = new IcalExpander({ ics, maxIterations: 100 });
	const date = new Date();
	let events;
	if(e == "nu")events = icalExpander.between(amin(date, -preMins), amin(date, postMins)).events;
	else if(e == "volgende")events = icalExpander.after(date).events;
	else if(e == "vorige")events = icalExpander.before(date).events;
	events = JSON.parse(JSON.stringify(events)); //waarom is dit niet gewoon een array?
	nEvents = new Array();
	events.forEach((item, i) => {
		nEvents[i] = new LesEvent(item);
	});
	const cEv = (ev0, ev1) =>{
		if(Date.parse(ev0.properties.dtstart.value) > Date.parse(ev1.properties.dtstart.value)) return 1;
		else if(Date.parse(ev0.properties.dtstart.value) < Date.parse(ev1.properties.dtstart.value)) return -1;
		else return 0;
	}
	nEvents.sort(cEv);

	if (events.length > 0) {
		if(e == "nu") var cEvent = nEvents.pop();
		else if(e == "volgende") var cEvent = nEvents.shift();
		else if(e == "vorige") var cEvent = nEvents.pop();
		let description = "";
		const uA = cEvent.properties.summary.value.split(/\[([x>!o]|toets)\] /g).pop().split(" ");
		const klas = cEvent.properties.summary.value.split(/\[([x>!o]|toets)\] /g).pop().split(" ");
		klas.shift();
		klas.shift();
		const uO = {
			"lokaal": uA[0],
			"vak": uA[1],
			"klas": klas,
			"vervalt": (cEvent.properties.description.value.indexOf("[x]") > -1),
			"verplaatst": (cEvent.properties.description.value.indexOf("verplaatst") > -1),
			"lokaalwijz": (cEvent.properties.description.value.indexOf("lokaal") > -1), // waarom geen docent?
			"van": cEvent.properties.dtstart.value,
			"tot": cEvent.properties.dtend.value
		}
		const rObj = {"type": "les", "val": uO, "ev": events};
		return rObj;
	}
	const rObj = {"type": "error", "err": "Je hebt nu geen les."};
	return rObj;
}
//#################################################################################

function vakNaam(ln) {
	ln = ln.toLowerCase();
	if(ln == "ne" || ln == "netl") return "Nederlands";
	else if(ln == "sk" || false) return "Scheikunde";
	else if(ln == "du" || ln == "dutl") return "Duits";
	else if(ln == "na" || false) return "Natuurkunde";
	else if(ln == "wi" || ln == "wisa" || false) return "Wiskunde";
	else if(ln == "fa" || false) return "Frans";
	else if(ln == "en" || ln == "entl") return "Engels";
	else if(ln == "ak") return "Aardrijkskunde"; 
	else if(ln == "ls" || ln == "os" || ln == "kwtb" || ln == "prog" || ln == "k&c" || ln == "gr" || ln == "la" || ln == "o&o") return "Keuzevak";
	else if(ln == "men") return "Mentoruur";
	else if(ln == "gs" || ln == "ges") return "Geschiedenis";
	else if(ln == "lo") return "Gym";
	else if(ln == "ec" || ln == "econ") return "Economie";
	else if(ln == "gltc") return "Grieks en Latijnse Taal en Cultuur";
	else if(ln == "bi" || false) return "Biologie";
	else if(ln == "mwh") return "Mediawijsheid";
	else if(ln == "sbu") return "Studiebegeleidingsuur";
	else if(ln == "te" || false) return "Tekenen";
	else if(ln == "mu" || false) return "Muziek";
	else if(ln == "act") return "Activiteit";
	else if(ln == "ckvc") return "Culturele en kunstzinnige vorming";
	else if(ln == "in") return "Informatica";
	else if(ln == "maat") return "Maatschappijleer"
	else return ln + " (Adriaan heeft deze nog geen naam gegeven, pm hem pls)";
}

const command = async function(args, msg){
	if(args[0] == "volgend" || args[0] == "volgende") var les = lesNu(lesData , 0, 30, "volgende");
	else if(args[0] == "vorig" || args[0] == "vorige") var les = lesNu(lesData , 0, 30, "vorige");
	else var les = lesNu(lesData , 0, 30, "nu");
	//console.log(les);
	let embed;
	if(les.type == "les"){
		if(vakNaam(les.val.vak) == "Keuzevak") {les.val.klas = ["v3.??1", "v3_tto.??1"]; les.val.lokaal = "ergens"}
		embed = new Discord.MessageEmbed()
		.setTitle(vakNaam(les.val.vak))
		.setColor('#c5044c')
		.setTimestamp(Date.parse(les.val.van))
		.setFooter("|", "https://raw.githubusercontent.com/v3dbot/v3dbot.github.io/main/img/zermelo.png")
		.addFields([
			{
				"name": "Vak",
				"value": vakNaam(les.val.vak)
			},
			{
				"name": "Lokaal",
				"value": les.val.lokaal
			},
			{
				"name": "Klas(sen)",
				"value": JSON.stringify(les.val.klas)
			},
			{
				"name": "Van",
				"value": les.val.van,
				"inline": true
			},
			{
				"name": "Tot",
				"value": les.val.tot,
				"inline": true
			}
		]);
		//;console.log(JSON.stringify(les.ev));
	} else if(les.type == "error") embed = "`" + les.err + "`";
	else embed = "ROEP ADRIAAN PLS!!!!```" + JSON.stringify(les) + "```";

	//console.log(embed);
	msg.channel.send(embed);
}
const init = async function (callback) {
	download(`https://${process.env.ZPORTAL_PREFIX}.zportal.nl/api/v2/ical?access_token=${process.env.ZERMELO_TOKEN}&startWeekOffset=0&endWeekOffset=2&valid=true&user=~me`, ".", {"filename": "rooster.ics"}).then(_=>{

		lesData = fs.readFileSync('./rooster.ics', 'utf-8');
		console.log("downloaded lesson data");
		if(callback) callback();
	});
};
module.exports = {command, init, hasInit:true, iAmAValidCommand: true};
