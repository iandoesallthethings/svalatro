import { type Card, type Suit, type Rank, createCard, allSuits, allRanks } from './Cards'

export function createDeck(suits: Suit[], ranks: Rank[]): Card[] {
	return suits.flatMap((suit) => ranks.map((rank) => createCard(suit, rank)))
}

export function standardDeck(): Card[] {
	return createDeck(allSuits, allRanks)
}

// Some sample weird decks from the original balatro
export function plaidDeck(): Card[] {
	return createDeck(['spades', 'spades', 'hearts', 'hearts'], allRanks)
}
