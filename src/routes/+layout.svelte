<script lang="ts">
	import '../app.css'

	let { children } = $props()
</script>

<main class="flex h-screen w-screen flex-col overflow-hidden">
	{@render children()}
</main>
