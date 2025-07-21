import { type Card, faceToValue } from './Cards'
import { shuffleDeck } from './Shuffle'

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

export function createCardStack(initialCards: Card[] = []): CardStack {
	let cards = $state(initialCards)

	function shuffle() {
		cards = shuffleDeck(cards)
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
