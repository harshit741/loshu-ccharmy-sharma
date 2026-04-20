'use client'

import { MotionConfig } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const isCoarsePointer = useMediaQuery('(pointer: coarse)')

  return (
    <MotionConfig reducedMotion={isCoarsePointer ? 'always' : 'user'}>
      {children}
    </MotionConfig>
  )
}
