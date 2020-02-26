var Card = require('./card.js');
var handsResolver = require('./cardsEvaluation.js');

function testRoyalFlush() {
    let cards = [new Card(2, 1), new Card(8, 0), new Card(9, 0), new Card(12, 0), new Card(10, 0), new Card(11, 0), new Card(4, 3)];
    console.assert(handsResolver(cards).handLevel == 9);
    console.assert(handsResolver(cards).bestCard == 12);
}

function testStraightFlush() {
    let cards = [new Card(2, 1), new Card(3, 1), new Card(4, 1), new Card(5, 1), new Card(6, 1), new Card(11, 0), new Card(4, 3)];
    console.assert(handsResolver(cards).handLevel == 8);
    console.assert(handsResolver(cards).bestCard == 6);
}

function testFourOfAKind() {
    let cards = [new Card(4, 1), new Card(4, 0), new Card(4, 3), new Card(4, 2), new Card(6, 1), new Card(11, 0), new Card(0, 3)];
    console.assert(handsResolver(cards).handLevel == 7);
    console.assert(handsResolver(cards).bestCard == 4);
}

function testFullHouse() {
    let cards = [new Card(4, 1), new Card(4, 0), new Card(4, 3), new Card(2, 2), new Card(2, 1), new Card(11, 0), new Card(0, 3)];
    console.assert(handsResolver(cards).handLevel == 6);
    console.assert(handsResolver(cards).bestCard == 4);
}

function testFlush() {
    let cards = [new Card(3, 1), new Card(5, 1), new Card(7, 1), new Card(9, 1), new Card(11, 1), new Card(11, 0), new Card(0, 3)];
    console.assert(handsResolver(cards).handLevel == 5);
    console.assert(handsResolver(cards).bestCard == 11);
    console.log(handsResolver(cards).handLevel);
}

function testStraight() { // Detects flush, not straight
    let cards = [new Card(3, 0), new Card(5, 1), new Card(4, 2), new Card(6, 3), new Card(2, 1), new Card(11, 0), new Card(0, 3)];
    console.assert(handsResolver(cards).handLevel == 4);
    console.assert(handsResolver(cards).bestCard == 6);
}

function testThreeOfAKind() {
    let cards = [new Card(3, 1), new Card(3, 3), new Card(3, 2), new Card(9, 1), new Card(11, 1), new Card(10, 0), new Card(0, 3)];
    console.assert(handsResolver(cards).handLevel == 3);
    console.assert(handsResolver(cards).bestCard == 3);
}

function testTwoPairs() {
    let cards = [new Card(3, 1), new Card(1, 3), new Card(3, 2), new Card(9, 1), new Card(11, 1), new Card(11, 0), new Card(0, 3)];
    console.assert(handsResolver(cards).handLevel == 2);
    console.assert(handsResolver(cards).bestCard == 11);
}

function testPair() {
    let cards = [new Card(10, 1), new Card(1, 3), new Card(11, 2), new Card(9, 1), new Card(4, 1), new Card(11, 0), new Card(0, 3)];
    console.assert(handsResolver(cards).handLevel == 1);
    console.assert(handsResolver(cards).bestCard == 11);
}

function testHighCard() {
    let cards = [new Card(0, 0), new Card(1, 1), new Card(2, 2), new Card(3, 3), new Card(5, 0), new Card(7, 1), new Card(8, 3)];
    console.assert(handsResolver(cards).handLevel == 0);
    console.assert(handsResolver(cards).bestCard == 8);
}


testRoyalFlush();
testStraightFlush();
testFourOfAKind();
testFullHouse();
testFlush();
testStraight();
testThreeOfAKind();
testTwoPairs();
testPair();
testHighCard();


function testFive() {
    let cards = [new Card(9, 0), new Card(0, 1), new Card(8, 0), new Card(9, 2), new Card(11, 2), new Card(1, 2), new Card(8, 2)]
    console.assert(handsResolver(cards).handLevel == 2);
}

testFive();