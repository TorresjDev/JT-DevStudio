/** Shared Framer Motion presets — keep interactions consistent app-wide. */
export const easeOut = [0.22, 1, 0.36, 1] as const

export const springSnappy = {
	type: 'spring' as const,
	stiffness: 420,
	damping: 32,
	mass: 0.8,
}

export const springSoft = {
	type: 'spring' as const,
	stiffness: 320,
	damping: 28,
	mass: 0.9,
}

export const fadeUp = {
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 6 },
	transition: { duration: 0.22, ease: easeOut },
}

export const scaleIn = {
	initial: { opacity: 0, scale: 0.96 },
	animate: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.98 },
	transition: springSnappy,
}

export const staggerContainer = {
	animate: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
}

export const staggerItem = {
	initial: { opacity: 0, x: -6 },
	animate: { opacity: 1, x: 0 },
	transition: { duration: 0.18, ease: easeOut },
}
