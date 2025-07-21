/** Non-mutating Fischer-Yates shuffle */
export function shuffleDeck<T>(deck: T[]): T[] {
	const shuffledDeck = [...deck]
	let currentIndex = shuffledDeck.length
	let randomIndex: number

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--
		;[shuffledDeck[currentIndex], shuffledDeck[randomIndex]] = [
			shuffledDeck[randomIndex],
			shuffledDeck[currentIndex]
		]
	}

	return shuffledDeck
}
