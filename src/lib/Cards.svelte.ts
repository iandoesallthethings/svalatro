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
	suit: Suit
	rank: Rank
}

function createDeck(suits: Suit[], ranks: Rank[]): Card[] {
	return suits.flatMap((suit) => ranks.map((rank) => ({ suit, rank })))
}

export interface CardStack {
	cards: Card[]
	shuffle: () => Card[]
	draw: () => Card | null
	add: (card: Card | Card[]) => Card[]
}

export function cardStack(initialSuits: Suit[] = [], initialRanks: Rank[] = []): CardStack {
	const initialCards = createDeck(initialSuits, initialRanks)
	let cards = $state(initialCards)

	function shuffle(): Card[] {
		cards = cards.sort(() => Math.random() - 0.5)
		return cards
	}

	function add(card: Card | Card[]): Card[] {
		if (Array.isArray(card)) {
			cards.push(...card)
		} else {
			cards.push(card)
		}
		return cards
	}

	function draw(): Card | null {
		return cards.shift() ?? null
	}

	return {
		cards,
		shuffle,
		draw,
		add
	}
}
