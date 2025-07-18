<script lang="ts">
	import { allSuits, allRanks, cardStack } from '$lib/Cards.svelte'
	import Stack from '$lib/Stack.svelte'

	const deck = cardStack(allSuits, allRanks)
	deck.shuffle()
	const hand = cardStack()

	function drawCard() {
		const card = deck.draw()
		if (card !== null) hand.add(card)
	}
</script>

<div class="flex w-full flex-col justify-between gap-1 p-4">
	Deck
	<Stack stack={deck} facing="down" stackType="deck" onclick={drawCard} />

	Hand
	<Stack stack={hand} facing="up" stackType="row" />
</div>
