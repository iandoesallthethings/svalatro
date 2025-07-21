<script lang="ts">
	import { browser } from '$app/environment'
	import type { Card } from '$lib/Cards'
	import { createCardStack } from '$lib/CardStack.svelte'
	import * as Decks from '$lib/Decks'
	import Dialog from '$lib/Dialog.svelte'
	import { findViableHands } from '$lib/Scores'
	import Stack from '$lib/Stack.svelte'
	import * as Strings from '$lib/Strings'
	import * as Timing from '$lib/Timing'

	const MAX_SELECTED = 5
	const BLIND_SCORE = 300
	const MAX_JOKERS = 5
	const MAX_CONSUMABLES = 2

	const deck = createCardStack(Decks.standardDeck())
	const hand = createCardStack()
	const discard = createCardStack()
	// Placeholders - not sure if I'll use the same hook
	const jokers = createCardStack()
	const consumables = createCardStack()

	let showDialog = $state<'win' | 'lose' | false>(false)
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

	async function drawToHand(number: number) {
		for (const n of Array(number)) {
			const card = deck.draw()
			hand.add(card, 'bottom')
			if (handSort !== 'none') hand.sort(handSort)

			await Timing.wait()
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

	async function playSelected() {
		if (handsLeft === 0) return
		const { hand, cards } = scores[0]
		const actualScore = hand.score(hand.validate(cards))
		roundScore += actualScore

		await discardAndDraw()
		handsLeft--

		await Timing.wait()

		if (roundScore >= BLIND_SCORE) {
			showDialog = 'win'
		} else if (handsLeft === 0) {
			showDialog = 'lose'
		}
	}

	async function discardSelected() {
		if (discardsLeft === 0) return
		await discardAndDraw()
		discardsLeft--
	}

	async function discardAndDraw() {
		for (const card of selected) {
			hand.remove(card)
			discard.add(card)
			await Timing.wait()
		}

		await drawToHand(selected.length)
		selected = []
	}

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

<Dialog show={showDialog !== false}>
	<h1>{showDialog === 'win' ? 'You win!' : 'You lose!'}</h1>
	<div>You scored {roundScore} points.</div>

	<button class="primary" onclick={() => (window.location.href = '/')}>
		{showDialog === 'win' ? 'Play' : 'Try'} again
	</button>
</Dialog>

<div class="m-auto flex w-full flex-row items-center justify-between gap-2 p-4">
	<div class="panel flex h-full max-w-xs flex-col gap-2">
		<div class="p-2">
			<h1 class="text-center text-4xl!">Svalatro</h1>
		</div>

		<div class="stat-card">
			<h1>Blind</h1>
			<h1 class="text-4xl">{BLIND_SCORE}</h1>
		</div>

		<div class="stat-card">
			<h3 class="w-1/3">Round Score</h3>
			<h3 class="w-2/3 text-center">{roundScore}</h3>
		</div>

		<div class="stat-card flex-col">
			<h2>{Strings.camelToTitle(scores[0]?.hand.name ?? '-')}</h2>

			<div class="flex flex-row items-center justify-evenly gap-2">
				<h2>{scores[0]?.hand.baseChips ?? 0}</h2>
				<h2>x</h2>
				<h2>{scores[0]?.hand.baseMult ?? 0}</h2>
			</div>
		</div>

		<div class="stat-card">
			<div class="flex flex-col items-center justify-center">
				<h2>Hands</h2>
				<h2>{handsLeft}</h2>
			</div>

			<div class="flex flex-col items-center justify-center">
				<h2>Discards</h2>
				<h2>{discardsLeft}</h2>
			</div>
		</div>
	</div>

	<div class="flex grow flex-col">
		<div class="flex flex-row justify-end gap-2">
			<Stack
				stack={jokers}
				type="row"
				facing="up"
				label="Jokerz (0/{MAX_JOKERS})"
				class="panel grow"
			/>
			<Stack
				stack={consumables}
				type="row"
				facing="up"
				label="Consumables (0/{MAX_CONSUMABLES})"
				class="panel"
			/>
		</div>

		<div class="flex w-full grow flex-row gap-2">
			<div class="play-area flex w-22 grow flex-col justify-center gap-2">
				<Stack stack={hand} {selected} facing="up" type="row" fan={true} onclick={toggleSelected} />

				<div class="controls flex flex-row justify-center gap-2">
					<button
						class="primary w-28! text-xl"
						onclick={playSelected}
						disabled={scores.length === 0 || handsLeft === 0}
					>
						Play
					</button>

					<div class="flex flex-col items-center gap-1 rounded-lg border p-2">
						<div>Sort Hand</div>
						<div class="flex flex-row gap-1">
							<button
								onclick={() => toggleSort('rank')}
								class="secondary ring-yellow-500"
								class:ring-3!={handSort === 'rank'}
							>
								Rank
							</button>

							<button
								onclick={() => toggleSort('suit')}
								class="secondary ring-yellow-500"
								class:ring-3!={handSort === 'suit'}
							>
								Suit
							</button>
						</div>
					</div>

					<button
						class="danger w-28! text-xl"
						onclick={discardSelected}
						disabled={selected.length === 0 || discardsLeft === 0}
					>
						Discard
					</button>
				</div>
			</div>

			<div class="deck-area flex h-full flex-col justify-end gap-2 p-2">
				<Stack
					stack={deck}
					facing="down"
					type="deck"
					label="Deck ({deck.cards.length}/{deck.initialCards.length})"
				/>

				<Stack stack={discard} facing="up" type="deck" label="Discard ({discard.cards.length})" />
			</div>
		</div>
	</div>
</div>
