module.exports = function(cards) {
    console.log(cards);
    cards.sort((card1, card2) => (card1.rank > card2.rank) ? -1 : 1);
    cards.sort((card1, card2) => (card1.suit > card2.suit) ? -1 : 1);
    console.log(cards);

    if (isRoyalFlush(cards))
        return 9
    if (isStraightFlush(cards))
        return 8;
    if (isFourOfAKind(cards))
        return 7;
    if (isFullHouse(cards))
        return 6;
    if (isFlush(cards))
        return 5;
    if (isStraight(cards))
        return 4;
    if (isThreeOfAKind(cards))
        return 3;
    if (isTwoPairs(cards))
        return 2;
    if (isPair(cards))
        return 1;

    return 0;
}

/*
    2 = 0,
    3 = 1,
    4 = 2,
    5 = 3,
    6 = 4,
    7 = 5,
    8 = 6,
    9 = 7,
    10 = 8,
    J = 9,
    Q = 10,
    K = 11,
    A = 12
*/

function isRoyalFlush(cards) { // 9
    for (let i = 0; i < 3; i++) {
        if (cards[i].suit == cards[i+1].suit) {
            if (cards[i].rank == 12) { // IS FIRST CARD IS AN AS
                for (let j = i; j < i+4; j++) {
                    if (((cards[i].rank - cards[i+1].rank) != 1) || (cards[i].suit != cards[i+1].suit))
                        return false;
                }
    
                return true;
            }
        }
    }

    return false;
}

function isStraightFlush(cards) { // 8
    for (let i = 0; i < 3; i++) {
        if (cards[i].suit == cards[i+1].suit) {
            for (let j = i; j < i+4; j++) {
                if (((cards[i].rank - cards[i+1].rank) != 1) || (cards[i].suit != cards[i+1].suit))
                    return false;
            }

            return true;
        }
    }

    return false;
}

function isFourOfAKind(cards) { // 7
    for (let i = 0; i < 4; i++) {
        if (cards[i].rank == cards[i+1].rank && cards[i].rank == cards[i+2].rank && cards[i].rank == cards[i+3].rank)
            return true;
    }

    return false;
}

function isFullHouse(cards) { // 6
    let tempCards = [].concat(cards);

    for (let i = 0; i < 5; i++) {
        if (tempCards[i].rank == cartempCardsds[i+1].rank && tempCards[i].rank == tempCards[i+2].rank) {
            tempCards.splice(i, 3);

            return isPair(tempCards);
        }
    }

    return false;
}

function isFlush(cards) { // 5
    for (let i = 0; i < 3; i++) {
        if (cards[i].suit == cards[i+1].suit) {
            for (let j = (i+1); j < i+5; j++) {
                if (cards[i].suit != cards[i+1].suit)
                    return false;
            }

            return true;
        }
    }
}

function isStraight(cards) { // 4
    for (let i = 0; i < 3; i++) {
        if (cards[i].rank - cards[i+1].rank == 1) {
            for (let j = (i+1); j < i+4; j++) {
                if ((cards[i].rank - cards[i+1].rank) != 1)
                    return false;
            }

            return true;
        }
    }

    return false;
}

function isThreeOfAKind(cards) { // 3
    for (let i = 0; i < 5; i++) {
        if (cards[i].rank == cards[i+1].rank && cards[i].rank == cards[i+2].rank)
            return true;
    }

    return false;
}

function isTwoPairs(cards) { // 2
    let tempCards = [];

    for (let i = 0; i < 5; i++) {
        if (tempCards[i].rank == tempCards[i+1].rank && tempCards[i].rank == tempCards[i+2].rank) {
            tempCards.splice(i, 2);

            return isPair(cards);
        }
    }

    return false;
}

function isPair(cards) { // 1
    for (let i = 0; i < 5; i++) {
        if (cards[i].rank == cards[i+1].rank)
            return true;
    }

    return false;
}

function getHighestCard(cards) { // 0
    return cards[0];
}