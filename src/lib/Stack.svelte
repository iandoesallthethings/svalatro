<script lang="ts">
	import type { CardStack, Facing, StackType, Card } from './Cards.svelte'
	import CardComponent from './Card.svelte'

	interface Props {
		stack: CardStack
		selected?: Card[]
		facing: Facing
		stackType: StackType
		label?: string
		onclick?: (card?: Card | null) => void
	}

	const {
		stack,
		selected = $bindable(),
		facing,
		stackType,
		label,
		onclick = (_card?: Card | null) => {}
	}: Props = $props()

	function fakeCardStack(count: number) {
		const fakeCount = Math.min(count - 1, 5)
		return Array.from({ length: fakeCount }, (_, i) => fakeCount - i - 1)
	}
</script>

<div class="flex flex-col gap-1">
	{#if stackType === 'deck'}
		<div class="relative flex flex-col gap-2">
			<CardComponent
				card={stack.cards[0] ?? null}
				{facing}
				onclick={() => onclick(stack.cards[0])}
				class="z-10"
			/>

			<!-- Dummy cards to make it look like a deck -->
			{#each fakeCardStack(stack.cards.length) as offset}
				<CardComponent
					card={{ suit: 'spades', rank: 'A', id: 'dummy' }}
					facing="down"
					class="pointer-events-none absolute!"
					style="left: -{offset + 1}px; top: {offset + 1}px"
				/>
			{/each}
		</div>
	{:else if stackType === 'row'}
		<div
			class="flex w-full flex-row flex-nowrap justify-start gap-4 overflow-x-auto overflow-y-visible pt-4 pr-24"
		>
			{#if stack.cards.length === 0}
				<CardComponent card={null} facing="down" />
			{/if}

			{#each stack.cards as card (card.id)}
				{@const isSelected = selected?.some((selectedCard) => selectedCard.id === card.id)}
				<CardComponent
					{card}
					{facing}
					onclick={() => onclick(card)}
					class={isSelected ? '-translate-y-2' : ''}
				/>
			{/each}
		</div>
	{:else if stackType === 'column'}
		<div class="flex flex-col gap-2">
			{#each stack.cards as card}
				<CardComponent {card} {facing} />
			{/each}
		</div>
	{/if}

	{#if label}
		<div class="self-start text-sm text-gray-500">{label}</div>
	{/if}
</div>
