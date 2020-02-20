var Card = require('./card.js');
var Player = require('./player.js');

exports.createGame = () => {
	this.turnNumber = 0;

	this.players = [];
	this.playerNext = undefined;
	this.inRound = false;

	this.pot = 0;
	this.maxBet = 0;

	this.cards = [];
	this.deck = [];

	for (var suit = 0; suit < 4; suit++) {
		for (var rank = 0; rank < 13; rank++) {
			this.cards.push(Card(rank, suit));
		}
	}
};

exports.addPlayer = (username) => {
	if (this.players.length > 7)
		return false;

	this.players.forEach(player => {
		if (player.username == username)
			return false;
	});

	this.players.push(Player(username));
	return true;
}


// GAME ACTIONS
exports.startRound = () => {
	if (!inRound || this.players.length > 1) {
		this.mix();
		this.distribute();
	}
}

exports.mix = () => {
	let newDeck = [];

	for (var i = 0; i < 52; i++) {
		newDeck.push(this.cards[getRandomInt(52-i)]);
	}

	this.cards = newDeck;
}

exports.distribute = () => {
	this.players.forEach(player => {
		player.cards.put(this.cards.pop());
		player.cards.put(this.cards.pop());
	});

	this.playerNext = players[this.turnNumber % this.players.length];
}

exports.drawCard = () => {
	if (this.deck.length == 0) {
		this.cards.put(this.cards.pop());
		this.cards.put(this.cards.pop());
	}

	this.cards.put(this.cards.pop());
}


// PLAYER ACTIONS
exports.bet = (player, amount) => {
	if (player == this.playerNext || player.money >= amount || amount >= this.maxBet) {
		player.money -= amount;
		player.bet += amount;

		if (amount > this.maxBet)
			this.maxBet = amount;

		let idPlayerNext = (this.turnNumber % this.players.length)+1;
		if (idPlayerNext >= this.players.length)
			idPlayerNext = 0;

		this.playerNext = this.players[idPlayerNext];
	}
}


// UTILS
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}