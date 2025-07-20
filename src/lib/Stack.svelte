<script lang="ts">
	import type { Facing, StackType, Card } from './Cards'
	import CardComponent from './Card.svelte'
	import { type CardStack } from './CardStack.svelte'
	import { flip } from 'svelte/animate'

	interface Props {
		stack: CardStack
		selected?: Card[]
		facing: Facing
		type: StackType
		label?: string
		onclick?: (card?: Card | null) => void
		class?: string
	}

	const {
		stack,
		selected = $bindable(),
		facing,
		type,
		label,
		onclick = (_card?: Card | null) => {},
		class: className = ''
	}: Props = $props()

	function fakeCardStack(count: number) {
		const fakeCount = Math.min(count - 1, 5)
		return Array.from({ length: fakeCount }, (_, i) => fakeCount - i - 1)
	}
</script>

<div class="flex flex-col gap-1 {className} pb-2">
	{#if type === 'deck'}
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
	{:else if type === 'row'}
		<div
			class="flex w-full flex-row flex-nowrap justify-center gap-4 overflow-x-auto pt-8 pr-24 pl-4"
		>
			{#if stack.cards.length === 0}
				<CardComponent card={null} facing="down" />
			{/if}

			{#each stack.cards as card (card.id)}
				{@const isSelected = selected?.some((selectedCard) => selectedCard.id === card.id)}
				<div class="group relative flex h-32 w-24 shrink" animate:flip={{ duration: 200 }}>
					<CardComponent
						{card}
						{facing}
						onclick={() => onclick(card)}
						class="
							absolute top-0 left-0 transition-all 
							group-hover:-translate-y-4 
							group-hover:shadow-lg!
							{isSelected ? '-translate-y-8!' : ''}
						"
					/>
				</div>
			{/each}
		</div>
	{/if}

	<div class="self-start text-sm text-gray-500">{label ?? ''}</div>
</div>
