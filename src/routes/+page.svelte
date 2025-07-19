<script lang="ts">
	import { browser } from '$app/environment'
	import { allSuits, allRanks, cardStack, type Card } from '$lib/Cards.svelte'
	import { findViableHands } from '$lib/Scores.svelte'
	import Stack from '$lib/Stack.svelte'

	const GOAL_SCORE = 300

	const deck = cardStack(allSuits, allRanks)
	const hand = cardStack()
	const discard = cardStack()

	let roundScore = $state(0)
	let handsLeft = $state(4)
	let discardsLeft = $state(4)

	let handSort = $state<'rank' | 'suit' | 'none'>('rank')
	let selected = $state<Card[]>([])
	let scores = $derived(findViableHands(selected))

	if (browser) {
		deck.shuffle()
		drawToHand(8)
	}

	function drawToHand(number: number) {
		const cards = deck.draw(number)
		hand.add(cards, 'bottom')

		if (handSort !== 'none') {
			hand.sort(handSort)
		}
	}

	function toggleSort(newSort: 'rank' | 'suit') {
		if (newSort === handSort) {
			handSort = 'none'
		} else {
			handSort = newSort
			hand.sort(handSort)
		}
	}

	function playSelected() {
		if (handsLeft === 0) return
		roundScore += scores[0]?.baseScore ?? 0
		discardAndDraw()
		handsLeft--

		if (roundScore >= GOAL_SCORE) {
			alert('You win!')
		} else if (handsLeft === 0) {
			alert('You lose!')
		}
	}

	function discardSelected() {
		if (discardsLeft === 0) return
		discardAndDraw()
		discardsLeft--
	}

	function discardAndDraw() {
		hand.remove(selected)
		discard.add(selected)
		drawToHand(selected.length)
		selected = []
	}

	const MAX_SELECTED = 5
	function toggleSelected(card?: Card | null) {
		if (card == null) return
		const isAlreadySelected = selected.some((selectedCard) => selectedCard.id === card.id)
		if (isAlreadySelected) {
			selected = selected.filter((selectedCard) => selectedCard.id !== card.id)
		} else if (selected.length < MAX_SELECTED) {
			selected = [...selected, card]
		}
	}
</script>

<div class="flex h-full w-full flex-col justify-center gap-1 p-4 ring">
	<div class="flex flex-col gap-1">
		<p>Goal: {GOAL_SCORE}</p>
		<p>Round: {roundScore}</p>
		<p>Current Hand: {scores[0]?.hand.name ?? 'None'} {scores[0]?.baseScore ?? 0}</p>
		<p>Hands: {handsLeft}</p>
		<p>Discards: {discardsLeft}</p>
	</div>

	<Stack
		stack={hand}
		{selected}
		facing="up"
		stackType="row"
		onclick={toggleSelected}
		label="Hand"
	/>

	<div class="flex flex-row justify-center gap-1">
		<button onclick={() => toggleSort('rank')} class="secondary" class:ring!={handSort === 'rank'}>
			Rank
		</button>
		<button onclick={() => toggleSort('suit')} class="secondary" class:ring!={handSort === 'suit'}>
			Suit
		</button>
	</div>

	<div class="flex flex-row justify-end gap-1">
		<Stack
			stack={deck}
			facing="down"
			stackType="deck"
			label="Deck ({deck.cards.length}/{deck.initialCards.length})"
		/>

		<Stack stack={discard} facing="up" stackType="deck" label="Discard ({discard.cards.length})" />
	</div>

	<div class="flex flex-row justify-center gap-1">
		<button
			class="primary"
			onclick={playSelected}
			disabled={scores.length === 0 || handsLeft === 0}
		>
			Play
		</button>

		<button
			class="danger"
			onclick={discardSelected}
			disabled={selected.length === 0 || discardsLeft === 0}
		>
			Discard
		</button>
	</div>
</div>
