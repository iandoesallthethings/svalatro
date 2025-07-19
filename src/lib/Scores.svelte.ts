import { type Card, faceToValue } from './Cards.svelte'

class PokerHand {
	name: string
	baseChips: number
	baseMult: number
	validate: (cards: Card[]) => Card[]

	constructor(
		name: string,
		baseChips: number,
		baseMult: number,
		validate: (cards: Card[]) => Card[]
	) {
		this.name = name
		this.baseChips = baseChips
		this.baseMult = baseMult
		this.validate = validate
	}

	score(cards: Card[]) {
		return cards.reduce((acc, card) => acc + faceToValue(card.rank), this.baseChips) * this.baseMult
	}
}

export interface ScoredHand {
	hand: PokerHand
	cards: Card[]
	baseScore: number
}

export function findViableHands(cards: Card[]): ScoredHand[] {
	const viableHands = pokerHands
		.map((hand) => ({
			hand,
			cards: hand.validate(cards),
			baseScore: hand.score(hand.validate(cards))
		}))
		.filter((hand) => hand.cards.length > 0)
		.toSorted((a, b) => b.baseScore - a.baseScore)

	return viableHands
}

/** Returns the n members of the n of a kind */
function findOfAKind(cards: Card[], count: number, exact = false) {
	return cards
		.map((card) => {
			const matches = cards.filter((c) => c.rank === card.rank).length
			if (exact) {
				return matches === count ? card : null
			}
			return matches >= count ? card : null
		})
		.filter((c) => c !== null)
}

/** Returns the 3 members of the house */
function findHouse(cards: Card[]) {
	const triples = findOfAKind(cards, 3, true)
	const pairs = findOfAKind(cards, 2, true)
	return triples.length > 0 && pairs.length > 0 ? cards : []
}

/** Returns the 5 members of the straight */
function findStraight(cards: Card[]) {
	const sorted = cards.toSorted((a, b) => faceToValue(b.rank) - faceToValue(a.rank))
	const straightMembers = sorted
		.map((card, index) => {
			if (index === sorted.length - 1) return card
			if (faceToValue(card.rank) - faceToValue(sorted[index + 1].rank) === 1) return card
			return null
		})
		.filter((c) => c !== null)

	const straight = straightMembers.length >= 5 ? straightMembers : []

	return straight
}

/** Returns the 5 members of the flush */
function findFlush(cards: Card[]) {
	return cards
		.map((card) => {
			const matches = cards.filter((c) => c.suit === card.suit).length
			return matches >= 5 ? card : null
		})
		.filter((c) => c !== null)
}

const pokerHands = [
	new PokerHand('highCard', 5, 1, (cards: Card[]) => {
		return cards.toSorted((a, b) => faceToValue(b.rank) - faceToValue(a.rank)).slice(0, 1)
	}),

	new PokerHand('pair', 10, 2, (cards: Card[]) => {
		const pairs = findOfAKind(cards, 2)

		return pairs.length >= 2 ? pairs : []
	}),

	new PokerHand('twoPair', 20, 2, (cards: Card[]) => {
		const pairs = findOfAKind(cards, 2)

		return pairs.length >= 4 ? pairs : []
	}),

	new PokerHand('threeOfAKind', 30, 3, (cards: Card[]) => {
		const triples = findOfAKind(cards, 3)
		return triples.length >= 3 ? triples : []
	}),

	new PokerHand('straight', 30, 4, (cards: Card[]) => {
		return findStraight(cards)
	}),

	new PokerHand('flush', 35, 4, (cards: Card[]) => {
		return findFlush(cards)
	}),

	new PokerHand('fullHouse', 40, 4, (cards: Card[]) => {
		return findHouse(cards)
	}),

	new PokerHand('fourOfAKind', 60, 7, (cards: Card[]) => {
		return findOfAKind(cards, 4, true)
	}),

	new PokerHand('straightFlush', 100, 8, (cards: Card[]) => {
		const straight = findStraight(cards)
		const flush = findFlush(cards)
		return straight.length === 5 && flush.length === 5 ? cards : []
	}),

	new PokerHand('royalFlush', 100, 8, (cards: Card[]) => {
		const straight = findStraight(cards)
		const flush = findFlush(cards)
		return straight.length === 5 && flush.length === 5 && flush[0].rank === 'A' ? cards : []
	}),

	new PokerHand('fiveOfAKind', 120, 12, (cards: Card[]) => {
		const quintuplets = findOfAKind(cards, 5, true)
		return quintuplets.length === 5 ? quintuplets : []
	}),

	new PokerHand('flushHouse', 140, 14, (cards: Card[]) => {
		const flush = findFlush(cards)
		const house = findHouse(cards)
		return flush.length === 5 && house.length === 5 ? cards : []
	}),

	new PokerHand('flushFive', 160, 16, (cards: Card[]) => {
		const quintuplets = findOfAKind(cards, 5, true)
		const flush = findFlush(cards)
		return quintuplets.length === 5 && flush.length === 5 ? cards : []
	})
]
