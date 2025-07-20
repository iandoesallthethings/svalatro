<script lang="ts">
	import { suits, type Card, type Facing } from './Cards'

	interface Props {
		card: Card | null
		facing: Facing
		style?: string
		class?: string
		onclick?: (card?: Card | null) => void
	}

	const { card, facing, class: className = '', style = '', onclick = () => {} }: Props = $props()
</script>

<button
	class:!bg-white={card == null}
	class="unstyled card flex flex-col justify-between overflow-hidden {className}"
	{style}
	onclick={() => onclick?.(card)}
>
	{#if card == null}
		<div class="flex h-full w-full items-center justify-center">:|</div>
	{:else if facing === 'down'}
		<div class="flex h-full w-full items-center justify-center">:3</div>
	{:else if facing === 'up'}
		{@const emoji = suits[card.suit].emoji}
		{@const rank = card.rank}
		{@const color = suits[card.suit].color}

		<div class="card-marking {color}">
			<div>{emoji}</div>
			<div>{rank}</div>
		</div>

		<div class="card-marking align-self-end rotate-180 self-end {color}">
			<div>{emoji}</div>
			<div>{rank}</div>
		</div>
	{/if}
</button>

<style lang="postcss">
	@reference "tailwindcss";

	.card {
		@apply h-32 w-24 rounded border bg-gray-300 px-2 py-1 text-lg shadow;
	}

	.card-marking {
		@apply w-min origin-center text-center;
	}
</style>
