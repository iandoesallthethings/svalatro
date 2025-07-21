export const ANIMATION_TIMING = 100

export async function wait(ms = ANIMATION_TIMING) {
	await new Promise((resolve) => setTimeout(resolve, ms))
}
