const express = require('express');
const mustache = require('mustache-express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const SERVER_PORT = 3000;

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
		data.error = "Username is required !";
	else if (req.query.error == 2)
		data.error = "Can't add you to the party";
	else if (req.query.error == 3)
		data.error = "You must connect first";

	res.render('index', data);
});

app.get('/play', (req, res) => {
	let data = {
		'username': req.cookies.username
	};

	res.render('game', data);
});

app.get('/start', (req, res) => {
	game.startRound();

	res.end();
});

app.get('/update', (req, res) => {
	try {
		let username = req.cookies.username;

		res.json(game.getGameInfo(username));
	} catch (err) {
		console.error(err);
		res.writeHead(400);
		res.send();
	}
});

app.get('/check', (req, res) => {
	let username = req.cookies.username;

	game.bet(game.getPlayer(username), 0);

	res.end();
});

app.get('/raise/:amount', (req, res) => {
	let username = req.cookies.username;

	game.bet(game.getPlayer(username), req.params.amount);

	res.end();
});

app.get('/fold', (req, res) => {
	let username = req.cookies.username;
	game.fold(username);

	res.end();
});

app.get('/quit', (req, res) => {
	let username = req.cookies.username;
});

app.post('/connect', (req, res) => {
	let username = req.body.username;

	if (!username) {
		res.redirect('/connect?error=1');
		return;
	}

	if (!game.addPlayer(username)) {
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


app.listen(SERVER_PORT);