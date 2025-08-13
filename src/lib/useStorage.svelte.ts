import { browser } from '$app/environment'

interface State<T> {
	value: T
	reset: () => void
}

type StorageType = 'localStorage' | 'sessionStorage'

/**
 * Svelte 5's version of the "custom store" pattern. Use it like this:
 * ```svelte
 * <script lang="ts">
 * 	const myLocalStore = useLocalStorage('my-key', 0)
 * 	myLocalStore.value = 1
 * 	console.log(myLocalStore.value) // 1
 * </script>
 *
 * <input type="number" bind:value={$myLocalStore.value} />
 * <p>{$myLocalStore.value}</p>
 * ```
 *
 * I wish we had the ability to define our own "runes" with the $ syntax and direct assignment
 * so we didn't have to append .value to everything. That way switching between $state and $storage
 * would be seamless.
 * ```ts
 * // Note: THIS DOESN'T WORK I JUST WANT IT TO
 * // let number = $state(0)
 * let number = $storage('my-key', 0)
 * number = 1
 * console.log(number) // 1
 * ```
 * But there's a long discussion on github
 * about why they can/can't/should/shouldn't do that. Come on, @rich-harris just do it! :c
 * https://github.com/sveltejs/svelte/issues/11014
 */
export default function useStorage<T>(
	key: string,
	initialValue: T,
	storageType: StorageType = 'sessionStorage'
): State<T> {
	let fetchedValue = initialValue
	const currentValue = browser && window[storageType].getItem(key)
	if (currentValue) fetchedValue = JSON.parse(currentValue)

	let value = $state(fetchedValue)

	function save() {
		if (value != null) {
			window[storageType].setItem(key, JSON.stringify(value))
		} else {
			window[storageType].removeItem(key)
		}
	}

	function reset() {
		value = structuredClone(initialValue)
		save()
	}

	return {
		get value() {
			return value
		},
		set value(v) {
			value = v
			save()
		},
		reset
	}
}
