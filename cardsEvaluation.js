module.exports = (cards) => {
    cards.sort((card1, card2) => (card1.rank > card2.rank) ? -1 : 1);
    cards.sort((card1, card2) => (card1.suit > card2.suit) ? -1 : 1);

    let handResult;

    if (isRoyalFlush(cards))
        return {"handLevel": 9, "bestCard": 12};

    handResult = isStraightFlush(cards);
    if (handResult)
        return handResult;

    handResult = isFourOfAKind(cards);
    if (isFourOfAKind(cards))
        return handResult;

    handResult = isFullHouse(cards);
    if (isFullHouse(cards))
        return handResult;

    handResult = isFlush(cards);
    if (isFlush(cards))
        return handResult;

    handResult = isStraight(cards);
    if (isStraight(cards))
        return handResult;

    handResult = isThreeOfAKind(cards);
    if (isThreeOfAKind(cards))
        return handResult;

    handResult = isTwoPairs(cards);
    if (isTwoPairs(cards))
        return handResult;

    handResult = isPair(cards);
    if (isPair(cards))
        return handResult;

    return getHighestCard(cards);
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
                if (((cards[j].rank - cards[j+1].rank) != 1) || (cards[j].suit != cards[j+1].suit))
                    return false;
            }

            return {"handLevel": 8, "bestCard": cards[i].rank};
        }
    }

    return false;
}

function isFourOfAKind(cards) { // 7
    cards.sort((card1, card2) => (card1.rank > card2.rank) ? -1 : 1);

    for (let i = 0; i < 4; i++) {
        if (cards[i].rank == cards[i+1].rank && cards[i].rank == cards[i+2].rank && cards[i].rank == cards[i+3].rank)
            return {"handLevel": 7, "bestCard": cards[i].rank};
    }

    return false;
}

function isFullHouse(cards) { // 6
    let tempCards = [].concat(cards);

    for (let i = 0; i < 5; i++) {
        if (cards[i].rank == cards[i+1].rank && cards[i].rank == tempCards[i+2].rank) {
            tempCards.splice(i, 3);

            let pairResult = isPair(tempCards);
            
            if (pairResult)
                return {"handLevel": 6, bestCard: cards[i].rank}
            
            return false;
        }
    }

    return false;
}

function isFlush(cards) { // 5
    cards.sort((card1, card2) => (card1.suit > card2.suit) ? -1 : 1);

    for (let i = 0; i < 3; i++) {
        if (cards[i].suit == cards[i+1].suit) {
            for (let j = i; j < i+4; j++) {
                if (cards[j].suit != cards[j+1].suit)
                    return false;
            }

            return {"handLevel": 5, "bestCard": cards[i].rank};
        }
    }

    return false;
}

function isStraight(cards) { // 4
    cards.sort((card1, card2) => (card1.rank > card2.rank) ? -1 : 1);

    for (let i = 0; i < 3; i++) {
        if (cards[i].rank - cards[i+1].rank == 1) {
            for (let j = (i+1); j < i+4; j++) {
                if ((cards[j].rank - cards[j+1].rank) != 1)
                    return false;
            }

            return {"handLevel": 4, "bestCard": cards[i].rank};
        }
    }

    return false;
}

function isThreeOfAKind(cards) { // 3
    cards.sort((card1, card2) => (card1.rank > card2.rank) ? -1 : 1);

    for (let i = 0; i < 5; i++) {
        if (cards[i].rank == cards[i+1].rank && cards[i].rank == cards[i+2].rank)
            return {"handLevel": 3, "bestCard": cards[i].rank};
    }

    return false;
}

function isTwoPairs(cards) { // 2
    let tempCards = [].concat(cards);

    for (let i = 0; i < 5; i++) {
        if (tempCards[i].rank == tempCards[i+1].rank) {            
            tempCards.splice(i, 2);

            let pairResult = isPair(tempCards);

            if (pairResult)
                return {"handLevel": 2, "bestCard": ((cards[i].rank > pairResult.bestCard) ? cards[i].rank : pairResult.bestCard) }

            return false;
        }
    }

    return false;
}

function isPair(cards) { // 1
    for (let i = 0; i < cards.length-1; i++) {
        if (cards[i].rank == cards[i+1].rank)
            return {"handLevel": 1, "bestCard": cards[i].rank};
    }

    return false;
}

function getHighestCard(cards) { // 0
    return {"handLevel": 0, "bestCard": cards[0].rank}
}