<script lang="ts">
	import { suits, type Card, type Facing } from './Cards.svelte'

	interface Props {
		card: Card | null
		facing: Facing
		style?: string
		class?: string
	}

	const { card, facing, class: className = '', style = '' }: Props = $props()
</script>

<div class="card-wrapper group relative {className}" {style}>
	<div
		class:!bg-white={card == null}
		class="card absolute left-0 flex flex-col justify-between overflow-hidden"
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
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.card-wrapper {
		@apply relative h-32 w-24 shrink overflow-visible select-none;
		@apply group-hover:mx-5;
	}

	.card {
		@apply h-32 w-24 rounded border bg-gray-300 px-2 py-1 text-lg shadow;
		@apply group-hover:z-10 group-hover:-translate-y-1 group-hover:shadow-lg;
	}

	.card-marking {
		@apply w-min origin-center text-center;
	}
</style>
