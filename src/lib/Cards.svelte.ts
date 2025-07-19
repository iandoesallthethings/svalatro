export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'
export type Facing = 'up' | 'down'
export type StackType = 'row' | 'column' | 'deck'

export const suits = {
	hearts: {
		emoji: '♥',
		color: 'text-red-500'
	},
	diamonds: {
		emoji: '♦',
		color: 'text-orange-500'
	},
	clubs: {
		emoji: '♣',
		color: 'text-blue-500'
	},
	spades: {
		emoji: '♠',
		color: 'text-black'
	}
}

export const allSuits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
export const allRanks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

export interface Card {
	id: string
	suit: Suit
	rank: Rank
}

export function faceToValue(rank: Rank): number {
	if (rank === 'A') return 14
	if (rank === 'K') return 13
	if (rank === 'Q') return 12
	if (rank === 'J') return 11
	return parseInt(rank)
}

function createCard(suit: Suit, rank: Rank): Card {
	return {
		id: crypto.randomUUID(),
		suit,
		rank
	}
}

function createDeck(suits: Suit[], ranks: Rank[]): Card[] {
	return suits.flatMap((suit) => ranks.map((rank) => createCard(suit, rank)))
}

export interface CardStack {
	cards: Card[]
	initialCards: Card[]
	shuffle: () => void
	sort: (by: 'rank' | 'suit') => void
	draw: (number?: number) => Card[]
	add: (card: Card | Card[], to?: 'top' | 'bottom') => void
	remove: (card: Card | Card[]) => void
	reset: (to?: 'initial' | 'empty') => void
}

export function cardStack(initialSuits: Suit[] = [], initialRanks: Rank[] = []): CardStack {
	const initialCards = createDeck(initialSuits, initialRanks)
	let cards = $state(initialCards)

	function shuffle() {
		cards = cards.sort(() => Math.random() - 0.5)
	}

	function sort(by: 'rank' | 'suit') {
		cards = cards.toSorted((a, b) => {
			if (by === 'rank') {
				return faceToValue(b.rank) - faceToValue(a.rank)
			}
			return a.suit.localeCompare(b.suit)
		})
	}

	function add(cardOrCards: Card | Card[], to: 'top' | 'bottom' = 'top') {
		const cardsToAdd = Array.isArray(cardOrCards) ? cardOrCards : [cardOrCards]

		if (to === 'top') {
			cards.unshift(...cardsToAdd)
		} else {
			cards.push(...cardsToAdd)
		}
	}

	function draw(number: number = 1): Card[] {
		return cards.splice(0, number)
	}

	function remove(cardToRemove: Card | Card[]) {
		const cardsToRemove = Array.isArray(cardToRemove) ? cardToRemove : [cardToRemove]
		cards = cards.filter((card) => !cardsToRemove.some((c) => c.id === card.id))
	}

	function reset(to: 'initial' | 'empty' = 'empty') {
		cards = to === 'initial' ? initialCards : []
	}

	return {
		get cards() {
			return cards
		},

		get initialCards() {
			return initialCards
		},

		shuffle,
		sort,
		draw,
		add,
		remove,
		reset
	}
}
