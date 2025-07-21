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

<dialog
	bind:this={dialog}
	onclose={() => (show = false)}
	class="
		m-auto w-2/3 max-w-md rounded-xl
		bg-gray-700 p-8 text-gray-300 shadow-lg transition-all
	"
>
	<div class="dialog-content flex h-full w-full flex-col items-center gap-4 text-center">
		{@render children?.()}
	</div>
</dialog>
