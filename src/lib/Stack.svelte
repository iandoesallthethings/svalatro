<script lang="ts">
	import type { CardStack, Facing, StackType } from './Cards.svelte'
	import Card from './Card.svelte'

	interface Props {
		stack: CardStack
		facing: Facing
		stackType: StackType
		onclick?: (card?: Card) => void
	}

	const { stack, facing, stackType, onclick }: Props = $props()

	function fakeCardStack(count: number) {
		const fakeCount = Math.min(count - 1, 5)
		return Array.from({ length: fakeCount }, (_, i) => fakeCount - i - 1)
	}
</script>

<div>
	{#if stackType === 'deck'}
		<button class="relative flex flex-col gap-2" onclick={() => onclick?.()}>
			<Card card={stack.cards[0] ?? null} {facing} class="z-10" />

			<!-- Dummy cards to make it look like a deck -->
			{#each fakeCardStack(stack.cards.length) as offset}
				<Card
					card={{ suit: 'spades', rank: 'A' }}
					facing="down"
					class="pointer-events-none absolute!"
					style="left: -{offset + 2}px; top: {offset}px"
				/>
			{/each}
		</button>
	{:else if stackType === 'row'}
		<div
			class="flex w-full flex-row flex-nowrap justify-start gap-4 overflow-x-auto overflow-y-visible p-2 pr-24"
		>
			{#each stack.cards as card, index}
				<Card {card} {facing} />
			{/each}
		</div>
	{:else if stackType === 'column'}
		<div class="flex flex-col gap-2">
			{#each stack.cards as card}
				<Card {card} {facing} />
			{/each}
		</div>
	{/if}
</div>
