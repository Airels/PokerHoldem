var Card = require('./card.js');
var handsResolver = require('./cardsEvaluation.js');

function testRoyalFlush() {
    let cards = [new Card(2, 1), new Card(8, 0), new Card(9, 0), new Card(12, 0), new Card(10, 0), new Card(11, 0), new Card(4, 3)];
    console.assert(handsResolver(cards) == 9);
}

function testStraightFlush() {
    let cards = [new Card(2, 1), new Card(3, 1), new Card(4, 1), new Card(5, 1), new Card(6, 1), new Card(11, 0), new Card(4, 3)];
    console.assert(handsResolver(cards) == 8);
}

function testFourOfAKind() {
    let cards = [new Card(4, 1), new Card(4, 0), new Card(4, 3), new Card(4, 2), new Card(6, 1), new Card(11, 0), new Card(0, 3)];
    console.assert(handsResolver(cards) == 7);
}

function testFullHouse() {
    let cards = [new Card(4, 1), new Card(4, 0), new Card(4, 3), new Card(2, 2), new Card(2, 1), new Card(11, 0), new Card(0, 3)];
    console.assert(handsResolver(cards) == 6);
}

function testFlush() {
    let cards = [new Card(3, 1), new Card(5, 1), new Card(7, 1), new Card(9, 1), new Card(11, 1), new Card(11, 0), new Card(0, 3)];
    console.assert(handsResolver(cards) == 5);
}

function testStraight() { // Detects flush, not straight
    let cards = [new Card(3, 0), new Card(5, 1), new Card(4, 2), new Card(6, 3), new Card(2, 1), new Card(11, 0), new Card(0, 3)];
    console.assert(handsResolver(cards) == 4);
}

function testThreeOfAKind() {
    let cards = [new Card(3, 1), new Card(3, 3), new Card(3, 2), new Card(9, 1), new Card(11, 1), new Card(10, 0), new Card(0, 3)];
    console.assert(handsResolver(cards) == 3);
}

function testTwoPairs() {
    let cards = [new Card(3, 1), new Card(1, 3), new Card(3, 2), new Card(9, 1), new Card(11, 1), new Card(11, 0), new Card(0, 3)];
    console.assert(handsResolver(cards) == 2);
    console.log(handsResolver(cards));
}

function testPair() {
    let cards = [new Card(10, 1), new Card(1, 3), new Card(11, 2), new Card(9, 1), new Card(4, 1), new Card(11, 0), new Card(0, 3)];
    console.assert(handsResolver(cards) == 1);
}

function testHighCard() {
    let cards = [new Card(0, 0), new Card(1, 1), new Card(2, 2), new Card(3, 3), new Card(5, 0), new Card(7, 1), new Card(8, 3)];
    console.assert(handsResolver(cards) == 0);
}


testRoyalFlush();
testStraightFlush();
testFourOfAKind();
testFullHouse();
testFlush();
testStraight();
testThreeOfAKind();
// testTwoPairs();
testPair();
testHighCard();