<script lang="ts">
	import type { Facing, StackType, Card } from './Cards'
	import CardComponent from './Card.svelte'
	import { type CardStack } from './CardStack.svelte'
	import { flip } from 'svelte/animate'
	import { receive, send } from './transition'

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
		<div class="relative mt-4 flex h-32 w-24 flex-col gap-2">
			{#if stack.cards.length === 0}
				<CardComponent card={null} facing="down" />
			{/if}

			{#each stack.cards.toReversed() as card, offset (card.id)}
				<div
					animate:flip={{ duration: 200 }}
					in:receive={{ key: card.id }}
					out:send={{ key: card.id }}
					class="absolute flex h-32 w-24"
					style="left: {offset / 4}px; top: -{offset / 4}px;"
				>
					<CardComponent {card} {facing} class="shadow-sm" />
				</div>
			{/each}
		</div>
	{:else if type === 'row'}
		<div
			class="flex w-full flex-row flex-nowrap justify-center gap-4 overflow-x-auto pt-8 pr-20 pl-2"
		>
			{#if stack.cards.length === 0}
				<CardComponent card={null} facing="down" class="mr-auto" />
			{/if}

			{#each stack.cards as card (card.id)}
				{@const isSelected = selected?.some((selectedCard) => selectedCard.id === card.id)}
				<div
					class="group relative flex h-32 w-24 shrink"
					animate:flip={{ duration: 200 }}
					in:receive={{ key: card.id }}
					out:send={{ key: card.id }}
				>
					<CardComponent
						{card}
						{facing}
						onclick={() => onclick(card)}
						class="
							absolute top-0 left-0 shadow 
							group-hover:-translate-y-4 
							group-hover:shadow-lg!
							{isSelected ? '-translate-y-8!' : ''}
						"
					/>
				</div>
			{/each}
		</div>
	{/if}

	<div class="self-start text-sm text-gray-400">{label ?? ''}</div>
</div>
