<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		show: boolean
		children: Snippet
	}

	let { show = $bindable(), children }: Props = $props()

	let dialog: HTMLDialogElement | null = $state(null)

	$effect(() => {
		if (show) dialog?.showModal()
		else dialog?.close()
	})
</script>

<dialog bind:this={dialog} onclose={() => (show = false)}>
	<div class="dialog-content">
		{@render children?.()}
	</div>
</dialog>

<style lang="postcss">
	@reference "tailwindcss";

	dialog {
		@apply m-auto w-2/3 max-w-md rounded-xl bg-white p-8 shadow-lg;
	}

	.dialog-content {
		@apply flex h-full w-full flex-col items-center gap-4 text-center;
	}

	dialog::backdrop {
	}
</style>
