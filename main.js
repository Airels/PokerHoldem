const express = require('express');
const mustache = require('mustache-express');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');

var game = require('./game.js');
game.createGame();

var app = express();
app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './public_html');

app.use(cookieParser());
app.use(bodyParser());

app.get('/', (req, res) => {
	res.redirect('/connect');
});

app.get('/connect', (req, res) => {
	let data = {error: ""};

	if (req.query.error == 1)
		data.error = "Un pseudonyme est obligatoire !";
	else if (req.query.else == 2)
		data.error = "Can't add you to the party";

	res.render('index', data);
});

app.get('/play', (req, res) => {
	let data = {
		'username': req.cookies.username
	};

	res.render('game', data);
});

app.get('/update', (req, res) => {

});

app.get('/check', (req, res) => {

});

app.get('/raise/:amount', (req, res) => {

});

app.get('/fold', (req, res) => {

});

app.get('/quit', (req, res) => {

});

app.post('/connect', (req, res) => {
	let username = req.body.username;

	if (!username) {
		res.redirect('/connect?error=1');
		return;
	}

	let playerAdded = game.addPlayer(username);

	if (!playerAdded) {
		res.redirect('/connect?error=2');
		return;
	}


	res.cookie("username", username);
	res.redirect('/play');
});

app.use(express.static('./public_html'));

app.use((req, res) => {
	res.writeHead(404);
	res.end('404 ERROR - Not Found');
});


app.listen(3000);