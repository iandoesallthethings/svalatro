<script lang="ts">
	import type { Facing, StackType, Card } from './Cards'
	import CardComponent from './Card.svelte'
	import { type CardStack } from './CardStack.svelte'
	import { flip } from 'svelte/animate'

	interface Props {
		stack: CardStack
		selected?: Card[]
		facing: Facing
		stackType: StackType
		label?: string
		onclick?: (card?: Card | null) => void
		class?: string
	}

	const {
		stack,
		selected = $bindable(),
		facing,
		stackType,
		label,
		onclick = (_card?: Card | null) => {},
		class: className = ''
	}: Props = $props()

	function fakeCardStack(count: number) {
		const fakeCount = Math.min(count - 1, 5)
		return Array.from({ length: fakeCount }, (_, i) => fakeCount - i - 1)
	}
</script>

<div class="flex flex-col gap-1 {className}">
	{#if stackType === 'deck'}
		<div class="relative flex flex-col gap-2 pb-2">
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
			class="flex w-full flex-row flex-nowrap justify-center gap-4 overflow-x-auto overflow-y-visible pt-8 pr-24 pb-4 pl-4"
		>
			{#if stack.cards.length === 0}
				<CardComponent card={null} facing="down" />
			{/if}

			{#each stack.cards as card (card.id)}
				<CardComponent
					{card}
					{facing}
					onclick={() => onclick(card)}
					class="
						transition-all
						{selected?.some((selectedCard) => selectedCard.id === card.id) ? '-translate-y-8' : ''}
					"
				/>
				<!-- <div animate:flip={{ duration: 200 }} class="relative shrink! ring">
				</div> -->
			{/each}
		</div>
	{/if}

	{#if label}
		<div class="self-start text-sm text-gray-500">{label}</div>
	{/if}
</div>
