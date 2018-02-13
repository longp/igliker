require("dotenv").config();
const express = require("express");
const request = require('request');
const rp = require('request-promise');
const app = express();
const bodyParser = require("body-parser");
const logger = require("morgan");
const PORT = process.env.PORT || 3000;
const path = require('path');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/start", (req,res) => {
	console.log('start');
	let clientID = process.env.clientID;
	let redirectURI = process.env.redirectURI;
	let url = "https://www.instagram.com/oauth/authorize/?client_id=" + clientID + "&redirect_uri=" + redirectURI +"&response_type=code";
	res.redirect(url);
})
app.get("/callback/access_token", (req,res) => {
	let accessToken = req.query.code;

	if (!accessToken) {
		return res.json("no access code");
	}

	let options = {
		method: 'POST',
		url: 'https://api.instagram.com/oauth/access_token',
		formData: {
			client_id:process.env.clientID,
			client_secret:process.env.clientSecret,
			grant_type: 'authorization_code',
			redirect_uri: process.env.redirectURI,
			code:accessToken
		}
	}
	return rp(options)
	.then((response) => {
		return JSON.parse(response)
	})
	.then((response) => res.json(response))
	.catch((error) => res.json(error))
})
app.get("*", (req,res) => {
	res.send('<h1 style="color:green">IG Liker</h1>');
})

const server = app.listen(PORT, () => {
    console.log("listening on ", PORT);
});


// https://007aebaa.ngrok.io/callback/access_token
// https://007aebaa.ngrok.io/callback/authorization
// http://localhost:3000/callback/authorization
// http://localhost:3000/callback/access_token
