const Discord = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');

let lesData;
let locationData = {};
let classData = {};

const sort = (a,b) => {
	     if(a.start > b.start) return  1;
	else if(b.start > a.start) return -1;
	else                       return  0;
};

async function init(callback){
	const dn = new Date();
	const rString = `https://${process.env.ZPORTAL_PREFIX}.zportal.nl/api/v3/appointments?start=${Math.round(s2w(dn).getTime()/1000)}&end=${Math.round(a2w(dn).getTime()/1000)}&fields=appointmentInstance%2Cid%2ClastModified%2CstartTimeSlotName%2CendTimeSlotName%2Cstart%2Cend%2CbranchOfSchool%2Ctype%2Coptional%2Csubjects%2CchoosableInDepartmentCodes%2Cteachers%2ConlineTeachers%2CgroupsInDepartments%2ClocationsOfBranch%2Ccancelled%2CtimeChanged%2CteacherChanged%2CgroupChanged%2ClocationChanged%2CchangeDescription%2CschedulerRemark%2Ccontent%2Cvalid%2CudmUUID&user=~me`;
	let tmpld = await fetch(rString, {headers: {"Authorization": `Bearer ${process.env.ZERMELO_TOKEN}`}});
	let lesDataJ = await tmpld.json();
	lesData = lesDataJ.response.data;
	lesData.sort(sort);
	console.log("Lesson data loaded, loading location names..."); //from https://ZPORTAL_PREFIX.zportal.nl/api/v3/locationofbranches
	const tmplocd = JSON.parse(fs.readFileSync("./commands/data/Locations.json"));
	tmplocd.forEach((loc) => {
		locationData[loc.id] = loc.name;
	});
	console.log("Locations loaded, loading class names..."); //from https://ZPORTAL_PREFIX.zportal.nl/api/v3/groupindepartments
	const tmpcd = JSON.parse(fs.readFileSync("./commands/data/Class.json"));
	tmpcd.forEach((c) => {
		classData[c.id] = c.extendedName;
	});
	console.log("Class data loaded...");
	//https://ZPORTAL_PREFIX.zportal.nl/api/v3/appointments
	//?start=1625608800&end=1625695200
	//&fields=appointmentInstance%2Cid%2ClastModified%2CstartTimeSlotName%2CendTimeSlotName%2Cstart%2Cend%2CbranchOfSchool%2Ctype%2Coptional%2Csubjects%2CchoosableInDepartmentCodes%2Cteachers%2ConlineTeachers%2CgroupsInDepartments%2ClocationsOfBranch%2Ccancelled%2CtimeChanged%2CteacherChanged%2CgroupChanged%2ClocationChanged%2CchangeDescription%2CschedulerRemark%2Ccontent%2Cvalid%2CudmUUID
	//&user=~me
	if(callback) callback();
}

const a2w = (dt) => {
	const o = new Date();
	o.setTime(dt.getTime() + 1209600000);
	return o;
};

const s2w = (dt) => {
	const o = new Date();
	o.setTime(dt.getTime() - 1209600000);
	return o;
};

const amin = (dt, min) => {
	const o = new Date();
	o.setMinutes(dt.getMinutes() + min);
	return o;
};

const occurr = (a, b) => (a.match(b) || []).length;

const getEventsNow = (ld, d1, d2) => {
	let out = [];
	ld.forEach(l=>{
		if((l.start*1000 >= d1 && l.start*1000 <= d2) || (l.end*1000 >= d1 && l.end*1000 <= d2)) out.push(l);
	});
	return out;
};

const getEventsNext = (ld, d) => {
	let out = [];
	ld.forEach(l=>{
		if(l.start*1000 >= d) out.push(l);
	});
	return out;
};

const getEventsPrev = (ld, d) => {
	let out = [];
	ld.forEach(l=>{
		if(l.end*1000 <= d) out.push(l);
	});
	return out;
};

const classArrayStringify = a => {
	let out = [];

	a.forEach(b => out.push(classData[b]));
	return out;
};

const locationArrayStringify = a => {
	let out = [];
	a.forEach(b => out.push(locationData[b]));
	return out;
};
const dateOptions = { year: "numeric", weekday: 'long', time: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Amsterdam'};
const lesNu = (ics, preMins, postMins, e) => {
	e = e||"nu";
	const date = new Date();
	let events;
	if(e == "nu")events = getEventsNow(lesData, amin(date, -preMins), amin(date, postMins));
	else if(e == "volgende")events = getEventsNext(lesData, date);
	else if(e == "vorige")events = getEventsPrev(lesData, date);

	if (events.length > 0) {
		if(e == "nu") var cEvent = events.pop();
		else if(e == "volgende") var cEvent = events.shift();
		else if(e == "vorige") var cEvent = events.pop();
		let description = "";
		const d1 = new Date();
		d1.setTime(cEvent.start*1000);
		const d2 = new Date();
		d2.setTime(cEvent.end*1000);
		const uO = {
			"vak": cEvent.subjects,
			"klas": classArrayStringify(cEvent.groupsInDepartments),
			"lokaal": locationArrayStringify(cEvent.locationsOfBranch),
			"verandering": cEvent.changeDescription,
			"opmerking": cEvent.schedulerRemark,
			"leraar": [...cEvent.teachers].concat(cEvent.onlineTeachers),
			"van": d1.toLocaleTimeString("nl-NL", dateOptions),
			"tot": d2.toLocaleTimeString("nl-NL", dateOptions)
		}

		const rObj = {"type": "les", "val": uO, "ev": events};
		return rObj;
	}
	const rObj = {"type": "error", "err": "Je hebt nu geen les."};
	return rObj;
}

const subs = require("./data/subject.js");

function vakNaam(ln) {
	ln = ln.toLowerCase();
	if(subs[ln]) return subs[ln];
	else return subs._NO_CODE;
}

const vnArrayStringify = a => {
	let out = [];
	a.forEach(b => out.push(vakNaam(b)));
	return out;
};

const arrayn = a => {
	if(a.length > 0) return a;
	else return "NVT";
};

const command = async function(args, msg){
	if(args[0] == "volgend" || args[0] == "volgende") var les = lesNu(lesData , 0, 30, "volgende");
	else if(args[0] == "vorig" || args[0] == "vorige") var les = lesNu(lesData , 0, 30, "vorige");
	else var les = lesNu(lesData , 0, 30, "nu");
	let embed;
	if(les.type == "les"){
		if(vakNaam(les.val.vak[0]) == "Keuzevak") {les.val.klas = ["v3.??1", "v3_tto.??1"]; les.val.lokaal = "ergens"}
		embed = new Discord.MessageEmbed()
		.setTitle(vnArrayStringify(les.val.vak)+"")
		.setColor('#c5044c')
		.setTimestamp(Date.parse(les.val.van))
		.setFooter("|", "https://raw.githubusercontent.com/v3dbot/v3dbot.github.io/main/img/zermelo.png")
		.addFields([
			{
				"name": "Vak(ken)",
				"value": arrayn(vnArrayStringify(les.val.vak))
			},
			{
				"name": "Loka(a)l(en)",
				"value": arrayn(les.val.lokaal)
			},
			{
				"name": "Klas(sen)",
				"value": arrayn(les.val.klas)
			},
			{
				"name": "lera(a)r(en)",
				"value": arrayn(les.val.leraar)
			},
			{
				"name": "Van",
				"value": les.val.van || "NVT",
				"inline": true
			},
			{
				"name": "Tot",
				"value": les.val.tot || "NVT",
				"inline": true
			}
		]);
		if(les.val.verandering || les.val.opmerking) {
			embed.addFields([
				{
					"name": "Opmerking/Verandering",
					"value": (les.val.verandering && les.val.opmerking) || les.val.verandering || les.val.opmerking
				}
			]);
		}
	} else if(les.type == "error") embed = "`" + les.err + "`";
	else embed = "ROEP ADRIAAN PLS!!!!```" + JSON.stringify(les) + "```";
	msg.channel.send(embed);
};

module.exports = {command, init, hasInit:true, iAmAValidCommand: true};
