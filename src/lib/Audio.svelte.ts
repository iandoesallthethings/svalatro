import useStorage from './useStorage.svelte'

let mute = useStorage('mute', false)

export function getMute() {
	return mute.value
}

export function toggleMute() {
	mute.value = !mute.value
}

export async function playSound(name: string) {
	if (mute.value) return

	const sound = new Audio(`/sounds/${name}.mp3`)
	await sound.play()
	sound.addEventListener('ended', () => sound.remove(), { once: true })
}
