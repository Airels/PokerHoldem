module.exports = function(username) {
	this.username = username;
	this.money = 1000;
	this.bet = 0;
	this.cards = [];
	this.played = false;
	this.hasFold = true;
}