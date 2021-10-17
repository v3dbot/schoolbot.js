require('dotenv').config();
const express = require("express");
const Discord = require('discord.js');
const download = require('download');
const fs = require('fs');
let client = new Discord.Client();
let app = express();
let server = app.listen(process.env.PORT, console.log(`listening to port `+process.env.PORT));
const commandHandler = require("./commands");

function init(){
	client = new Discord.Client();
	client.on('message', (message) => commandHandler.handler(message) );
	client.on('ready', () => {
		console.log('Ready!');
	});
	client.login(process.env.TOKEN);
}
commandHandler.init(init);
app.get(`/keep/`, keep);
function keep(req, res){
	res.send("hi");
}
