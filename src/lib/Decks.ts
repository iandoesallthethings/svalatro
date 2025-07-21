import { type Card, type Suit, type Rank, createCard, standardSuits, standardRanks } from './Cards'

export function createDeck(suits: Suit[], ranks: Rank[]): Card[] {
	return suits.flatMap((suit) => ranks.map((rank) => createCard(suit, rank)))
}

export function standardDeck(): Card[] {
	return createDeck(standardSuits, standardRanks)
}

// Some sample weird decks from the original balatro
export function checkeredDeck(): Card[] {
	return createDeck(['spades', 'spades', 'hearts', 'hearts'], standardRanks)
}
