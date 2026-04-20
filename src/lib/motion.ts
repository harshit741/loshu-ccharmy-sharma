import type { Variants } from 'framer-motion'

const premiumEase: [number, number, number, number] = [0.4, 0, 0.2, 1]

export const staggerParent = (delayChildren = 0.08, staggerChildren = 0.12): Variants => ({
  hidden: {},
  show: {
    transition: {
      delayChildren,
      staggerChildren,
      ease: premiumEase,
    },
  },
})

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: premiumEase,
    },
  },
}
