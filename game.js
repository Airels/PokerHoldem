var Card = require('./card.js');
var Player = require('./player.js');

const PLAYER_LIMIT = 4;


exports.createGame = () => {
	this.turnNumber = 0;

	this.players = [];
	this.playerNext = undefined;
	this.inRound = false;

	this.showCards = false;

	this.pot = 0;
	this.maxBet = 0;

	this.cards = [];
	this.deck = [];
};

exports.addPlayer = (username) => {
	let found = false;

	if (this.players.length > PLAYER_LIMIT)
		return false;

	this.players.forEach((player) => {
		if (player.username == username) {
			found = true;
			return;
		}
	});

	if (!found)
		this.players.push(new Player(username));

	return !found;
}


// GAME ACTIONS
exports.startRound = () => {
	if (!this.inRound || this.players.length > 1) {
		this.inRound = true;
		this.generateCards();
		this.shuffle();
		this.distribute();
	}
}

exports.generateCards = () => {
	for (var suit = 0; suit < 4; suit++) {
		for (var rank = 0; rank < 13; rank++) {
			this.cards.push(new Card(rank, suit));
		}
	}
}

exports.shuffle = () => {
	for (var i = 0; i < 52; i++) {		
		let pos = i + getRandomInt(52-i);

		let cardTemp = this.cards[pos];
		this.cards[pos] = this.cards[i];
		this.cards[i] = cardTemp;
	}
}

exports.distribute = () => {
	this.players.forEach((player) => {
		player.cards.push(this.cards.pop());
		player.cards.push(this.cards.pop());
	});

	this.playerNext = this.players[this.turnNumber % this.players.length];
}

exports.drawCard = () => {
	if (this.deck.length == 0) {
		this.cards.push(this.cards.pop());
		this.cards.push(this.cards.pop());
	}

	this.cards.push(this.cards.pop());
}

exports.addBetsToPot = () => {
	this.players.forEach(player => {
		this.pot += player.bet;
		player.bet = 0;
	});
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
		if (this.playerNext.bet) {
			if (this.deck.length == 5) // IF GAME ENDED
				this.showCards = true;
			else {
				this.addBetsToPot();
			}
		}
	}
}

exports.fold = (username) => {

}


// OTHERS ACTIONS
exports.getGameInfo = (username) => {
	let player = this.getPlayer(username);

	let data = {
		"game": {
			"deck": [],
			"pot": this.pot,
			"maxBet": this.maxBet
		},
		"player": {
			"cards": player.cards,
			"bet": player.bet,
			"money": player.money,
			"yourTurn": (player.username == this.playerNext.username)
		},
		"opponents": []
	};

	let i = 0;
	this.players.forEach(player => {
		if (player.username == username)
			return;

		let cards;

		if (this.showCards)
			cards = players.cards;

		data.opponents.push({ // HAVE TO APPEND PLAYER
			"username": player.username,
			"bet": player.bet,
			"cards": cards
		});

		i++;
	});

	return data;
}

exports.getBestDeck = () => {

}


// UTILS
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

exports.getPlayer = (username) => {
	let playerFound;

	this.players.forEach((player) => {
		if (player.username == username) {
			playerFound = player;
			return;
		}
	});

	return playerFound;
}