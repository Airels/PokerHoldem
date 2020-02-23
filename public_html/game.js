var lPot, lBet, lMoney;
var firstCard, secondCard;
var startButton;

function init() {
	startButton = document.getElementById("startTurn");

	lPot = document.getElementById("pot");
	lBet = document.getElementById("bet");
	lMoney = document.getElementById("money");

	firstCard = document.getElementById('firstCard');
	secondCard = document.getElementById('secondCard');

	document.getElementById('opponent1').style.display = "none";
	document.getElementById('opponent2').style.display = "none";
	document.getElementById('opponent3').style.display = "none";

	setInterval(update, 500);
}

function update() {
	// XHR REQUEST TO /update
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "/update");
	xhr.send();

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let data = JSON.parse(xhr.responseText);

			if (data.game.status.canStart)
				startButton.style.display = "initial";
			else
				startButton.style.display = "none";

			lPot.innerHTML = data.game.pot;

			lBet.innerHTML = data.player.bet;
			lMoney.innerHTML = data.player.money;

			if (data.player.cards.length != 0) {
				firstCard.src = "resources/" + getSuit(data.player.cards[0].suit) + "/" + getRank(data.player.cards[0].rank) + ".png";
				secondCard.src = "resources/" + getSuit(data.player.cards[1].suit) + "/" + getRank(data.player.cards[1].rank) + ".png";
			} else {
				firstCard.src = "";
				secondCard.src = "";
			}
		
			for (let i = 0; i < data.opponents.length; i++) {
				let opponent = document.getElementById('opponent'+(i+1));
				opponent.style.display = "";
				opponent.getElementsByTagName('label')[0].innerHTML = data.opponents[i].username;
				opponent.getElementsByTagName('label')[1].innerHTML = data.opponents[i].bet;

				if (data.opponents[i].fold) {
					document.getElementById('firstCardOpponent'+(i+1)).src = "";
					document.getElementById('secondCardOpponent'+(i+1)).src = "";
				} else if (data.opponents[i].cards) {
					let opponentFirstCard = data.opponents[i].cards[0];
					let opponentSecondCard = data.opponents[i].cards[1];

					document.getElementById('firstCardOpponent'+(i+1)).src = "resources/" + getSuit(opponentFirstCard.suit) + "/" + getRank(opponentFirstCard.rank) + ".png";
					document.getElementById('secondCardOpponent'+(i+1)).src = "resources/" + getSuit(opponentSecondCard.suit) + "/" + getRank(opponentSecondCard.rank) + ".png";
				} else {
					document.getElementById('firstCardOpponent'+(i+1)).src = 'resources/back.png';
					document.getElementById('secondCardOpponent'+(i+1)).src = 'resources/back.png';
				}
			}

			for (let i = 0; i < 4; i++) {
				document.getElementById('player').getElementsByTagName('input')[i].disabled = !data.player.yourTurn;
			}

			let raiseAmountText = document.getElementById('raiseAmount');

			if (data.player.yourTurn && raiseAmountText.value < data.game.maxBet && raiseAmountText.value == "")
				raiseAmountText.value = data.game.maxBet - data.player.bet;

			let deck = data.game.deck;

			for (let i = 0; i < deck.length; i++) {
				document.getElementById('deckCard'+(i+1)).src = "resources/" + getSuit(deck[i].suit) + "/" + getRank(deck[i].rank) + ".png";
			}
		}
		else if (xhr.readyState == 4 && xhr.status == 400) {
			document.location.href = "/connect?error=3";
		}
	}
}

function startTurn() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "/start");
	xhr.send();

	update();
}

function fold() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "/fold");
	xhr.send();

	update();
}

function check() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "/check");
	xhr.send();

	update();
}

function raise() {
	let raiseAmount = document.getElementById('raiseAmount');

	if (raiseAmount.value == "")
		return;

	let xhr = new XMLHttpRequest();
	xhr.open("GET", "/raise/" + raiseAmount.value);
	xhr.send();

	raiseAmount.value = "";

	update();
}

function quit() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "/quit");
	xhr.send();
}


// UTILS
function getSuit(suitID) {
	switch (suitID) {
		case 0:
			return "clubs";
		case 1:
			return "diamonds";
		case 2:
			return "hearts";
		case 3:
			return "spades";
	}
}

function getRank(rankID) {
	switch (rankID) {
		case 0:
			return "2";
		case 1:
			return "3";
		case 2:
			return "4";
		case 3:
			return "5";
		case 4:
			return "6";
		case 5:
			return "7";
		case 6:
			return "8";
		case 7:
			return "9";
		case 8:
			return "10";
		case 9:
			return "J";
		case 10:
			return "Q";
		case 11:
			return "K";
		case 12:
			return "A";
	}
}