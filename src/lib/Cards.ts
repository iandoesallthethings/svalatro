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

export function createCard(suit: Suit, rank: Rank): Card {
	return {
		id: crypto.randomUUID(),
		suit,
		rank
	}
}
