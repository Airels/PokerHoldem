var Card = require('./card.js');
var Player = require('./player.js');
var getHandLevel = require('./cardsEvaluation.js');

const PLAYER_LIMIT = 4; // MAX: 4 (interface not adapted to more)
const PLAYER_MIN = 2; // MIN: 2 (if 1, errors may appear)
const MIN_BET = 20;


exports.createGame = () => {
	this.turnNumber = 0;

	this.players = [];
	this.indexPlayerNext = -1;
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
			return; // return for forEach, not for addPlayer
		}
	});

	if (!found)
		this.players.push(new Player(username));

	return !found;
}


// GAME ACTIONS
exports.startRound = () => {
	if (!this.inRound && this.players.length >= PLAYER_MIN) {
		this.turnNumber++;
		this.indexPlayerNext = this.turnNumber % this.players.length;

		this.inRound = true;

		this.cards = [];
		this.deck = [];
		this.showCards = false;

		this.players.forEach((player) => {
			player.cards = [];
			player.played = false;
			player.hasFold = false;
		})

		this.players[this.indexPlayerNext].bet = MIN_BET;
		this.players[this.indexPlayerNext].money -= MIN_BET;
		this.setNextPlayer();
		
		this.players[this.indexPlayerNext].bet = MIN_BET/2;
		this.players[this.indexPlayerNext].money -= MIN_BET/2;
		this.setNextPlayer();

		this.maxBet = MIN_BET;

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

		player.hasFold = false;
	});
}

exports.drawCard = () => {
	this.cards.pop();

	if (this.deck.length == 0) {
		this.deck.push(this.cards.pop());
		this.deck.push(this.cards.pop());
	}

	this.deck.push(this.cards.pop());
}

exports.addBetsToPot = () => {
	this.players.forEach(player => {
		this.pot += player.bet;
		player.bet = 0;
		player.played = false;
	});

	this.maxBet = 0;
}


// PLAYER ACTIONS
exports.fold = (username) => {
	this.getPlayer(username).cards = [];
	this.getPlayer(username).hasFold = true;
	this.setNextPlayer();
}

exports.bet = (player, betAmount) => {
	let playerNext = this.players[this.indexPlayerNext];

	let amount = parseInt(betAmount)+parseInt(player.bet);

	if (betAmount == 0) {
		if (this.maxBet > player.money)
			amount = player.money;
		else
			amount = this.maxBet;
	}

	if (player == playerNext && player.money >= betAmount && amount >= this.maxBet) {
		player.money -= amount-player.bet;
		player.bet = amount;

		if (amount > this.maxBet)
			this.maxBet = amount;

		player.played = true;
		this.setNextPlayer();
	} else if (player == playerNext && player.money >= amount && player.money < this.maxBet) {
		player.money -= amount-player.bet;
		player.bet = amount;

		player.played = true;
		this.setNextPlayer();
	}
}


// OTHERS ACTIONS
exports.setNextPlayer = () => {
	this.indexPlayerNext = ((this.indexPlayerNext+1) % this.players.length);
	let playerNext = this.players[this.indexPlayerNext];

	this.foldCheck();

	if (playerNext.hasFold || playerNext.money == 0) { // IF PLAYER DOESN'T HAVE CARDS OR DOESN'T HAVE MONEY
		this.setNextPlayer();
	}

	if (playerNext.bet == this.maxBet && playerNext.played) { // IF EVERYONE PLAYED
		this.addBetsToPot();

		this.allInCheck();

		if (this.deck.length == 5) { // IF GAME ENDED
			this.indexPlayerNext = -1;
			this.showCards = true;
			this.getBestDeck();
			this.inRound = false;
		} else {
			this.drawCard();
		}

		return;
	}
}

exports.allInCheck = () => {
	/* CHECK IF PLAYERS ALL IN */
	let countPlayersAllIn = 0;

	this.players.forEach((player) => {
		if (player.money == 0)
			countPlayersAllIn++;
	});

	if (countPlayersAllIn >= this.players.length-1) {
		this.addBetsToPot();

		for (let i = this.deck.length; i <= 5; i++)
			this.drawCard();

		this.indexPlayerNext = -1;
		this.showCards = true;
		this.getBestDeck();
		this.inRound = false;

		return;
	}
	/* END CHECK */
}

exports.foldCheck = () => {
	/* CHECK IF PLAYERS FOLD */
	let countPlayersFold = 0;

	this.players.forEach((player) => {
		if (player.hasFold)
			countPlayersFold++;
	});

	if (countPlayersFold >= this.players.length-1) {
		this.addBetsToPot();
		
		for (let i = this.deck.length; i <= 5; i++)
			this.drawCard();

		this.indexPlayerNext = -1;
		this.showCards = true;
		this.getBestDeck();
		this.inRound = false;

		return;
	}
	/* END CHECK */
}

exports.getGameInfo = (username) => {
	let player = this.getPlayer(username);
	let yourTurn;

	try {
		yourTurn = (player.username == this.players[this.indexPlayerNext].username);
	} catch (err) {
		yourTurn = false;
	}

	let data = {
		"game": {
			"status": {
				"canStart": (!this.inRound && this.players.length >= PLAYER_MIN)
			},
			"deck": this.deck,
			"pot": this.pot,
			"maxBet": this.maxBet
		},
		"player": {
			"cards": player.cards,
			"bet": player.bet,
			"money": player.money,
			"fold": player.hasFold,
			"yourTurn": yourTurn
		},
		"opponents": []
	};

	this.players.forEach(player => {
		if (player.username == username)
			return;

		let cards;

		if (this.showCards)
			cards = player.cards;

		data.opponents.push({ // HAVE TO APPEND PLAYER
			"username": player.username,
			"bet": player.bet,
			"cards": cards,
			"fold": player.hasFold,
			"money": player.money
		});
	});

	return data;
}

exports.getBestDeck = () => {
	let winners = [];
	let bestHands = [];

	this.players.forEach((player) => {
		if (!player.hasFold) {
			let playerHand = [];
			playerHand.push(player.cards[0]);
			playerHand.push(player.cards[1]);

			for (let i = 0; i < 5; i++)
				playerHand.push(this.deck[i]);

			let handInfos = getHandLevel(playerHand);

			bestHands.push({
				"player": player,
				"handLevel": handInfos.handLevel,
				"bestCard": handInfos.bestCard
			});
		} else {
			bestHands.push({
				"player": player,
				"handLevel": -1
			});
		}
	});

	bestHands.sort((hand1, hand2) => hand2.bestCard - hand1.bestCard);
	bestHands.sort((hand1, hand2) => hand2.handLevel - hand1.handLevel);

	winners.push(bestHands[0].player);

	for(let i = 0; i < bestHands.length-1; i++) {
		if (bestHands[i+1].handLevel == bestHands[i].handLevel && bestHands[i+1].bestCard == bestHands[i].bestCard)
			winners.push(bestHands[i+1].player);
		else
			break;
	}

	// CHECK OTHER CARD IN CASE OF EQUALITY
	/* if (winners.length > 1) {
		for (let i = 0; i < winners.length-1; i++) {
			let player1Card = (bestHands[i].bestCard == winners[i].cards[0]) ? winners[i].cards[1] : winners[i].cards[0];
			let player2Card = (bestHands[i+1].bestCard == winners[i+1].cards[0]) ? winners[i+1].cards[1] : winners[i+1].cards[0];

			if (player1Card.rank > player2Card.rank)
				winners.splice(i+1, 1);
			else if (player1Card.rank < player2Card.rank)
				winners.splice(i, 1);
		}
	} */

	console.log(bestHands);
	console.log(winners);

	if (winners.length > 1) {
		let quota = this.pot/winners.length;

		for(let i = 0; i < winners.length; i++) {
			winners[i].money += quota;
		}
	} else
		winners[0].money += this.pot;

	this.pot = 0;

	this.kickPlayersWhoLost();
}

exports.kickPlayersWhoLost = () => {
	for (let i = 0; i < this.players.length; i++) {
		let player = this.players[i];

		if (player.money < MIN_BET)
			this.players.splice(i, 1);
	}
}

exports.quitGame = (username) => {
	for (let i = 0; i < this.players.length; i++) {
		let player = this.players[i];

		if (player.username == username) {
			this.players.splice(i, 1);

			if (i == this.indexPlayerNext || this.players.length == 1) 
				this.setNextPlayer();
		}
	}
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