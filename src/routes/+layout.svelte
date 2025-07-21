<script lang="ts">
	import '../app.css'

	let { children } = $props()
</script>

<main class="flex h-screen w-screen flex-col overflow-hidden bg-gray-900 text-gray-200">
	{@render children()}
</main>
