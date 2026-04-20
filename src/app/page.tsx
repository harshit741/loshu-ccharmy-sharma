'use client'

import dynamic from 'next/dynamic'
import { useState, type ComponentProps, type ReactNode } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import LoshuSection from '@/components/sections/LoshuSection'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { ScrollScene } from '@/components/ui/ScrollScene'
import type { NumerologyResult } from '@/utils/numerology'
import Hero2Section from '@/components/sections/Hero2Section'
import { useMediaQuery } from '@/hooks/useMediaQuery'

type SceneWrapperProps = ComponentProps<typeof ScrollScene> & {
  disabled: boolean
  children: ReactNode
}

function SectionSkeleton() {
  return (
    <div className="max-container px-4 py-16 sm:px-6 sm:py-20 lg:py-24" aria-hidden="true">
      <div className="mx-auto mb-6 h-8 w-1/3 rounded-2xl shimmer-bg" style={{ background: 'var(--color-border)' }} />
      <div className="mx-auto mb-3 h-4 w-2/3 rounded-lg shimmer-bg" style={{ background: 'var(--color-border)' }} />
      <div className="h-4 rounded-lg shimmer-bg w-1/2 mx-auto" style={{ background: 'var(--color-border)' }} />
    </div>
  )
}

function SceneWrapper({ disabled, children, ...props }: SceneWrapperProps) {
  if (disabled) {
    return <div className={props.className}>{children}</div>
  }

  return <ScrollScene {...props}>{children}</ScrollScene>
}

const AnalysisSection = dynamic(() => import('@/components/sections/AnalysisSection'), {
  loading: SectionSkeleton,
})
const ServicesSection = dynamic(() => import('@/components/sections/ServicesSection'), {
  loading: SectionSkeleton,
})
const AboutSection = dynamic(
  () => import('@/components/sections/OtherSections').then(module => ({ default: module.AboutSection })),
  { loading: SectionSkeleton }
)
const TestimonialsSection = dynamic(
  () => import('@/components/sections/OtherSections').then(module => ({ default: module.TestimonialsSection })),
  { loading: SectionSkeleton }
)
const FAQSection = dynamic(
  () => import('@/components/sections/OtherSections').then(module => ({ default: module.FAQSection })),
  { loading: SectionSkeleton }
)
const ContactSection = dynamic(
  () => import('@/components/sections/OtherSections').then(module => ({ default: module.ContactSection })),
  { loading: SectionSkeleton }
)

export default function HomePage() {
  const [numerologyResult, setNumerologyResult] = useState<NumerologyResult | null>(null)
  const [clientName, setClientName] = useState('')
  const [clientDob,  setClientDob]  = useState('')
  const isCoarsePointer = useMediaQuery('(pointer: coarse)')
  const isTabletOrBelow = useMediaQuery('(max-width: 1023px)')
  const disableScrollScenes = isCoarsePointer || isTabletOrBelow

  const handleResult = (result: NumerologyResult, name: string, dob: string) => {
    setNumerologyResult(result)
    setClientName(name)
    setClientDob(dob)
  }

  return (
    <>
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
        style={{ background: 'var(--color-rose)', color: 'white' }}
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" tabIndex={-1}>
        <SceneWrapper disabled={disableScrollScenes} variant="cosmic" className="z-10">
          <HeroSection />
        </SceneWrapper>

        <SceneWrapper disabled={disableScrollScenes} variant="cosmic" className="z-10">
          <Hero2Section />
        </SceneWrapper>

        {/* <SectionDivider variant="wave" /> */}

        <SceneWrapper disabled={disableScrollScenes} variant="flow">
          <LoshuSection onResult={handleResult} />
        </SceneWrapper>

        {numerologyResult && (
          <SceneWrapper disabled={disableScrollScenes} variant="flow">
            <AnalysisSection result={numerologyResult} name={clientName} dob={clientDob} />
          </SceneWrapper>
        )}

        {/* <SectionDivider variant="wave" /> */}

        <SceneWrapper disabled={disableScrollScenes} variant="flow">
          <ServicesSection />
        </SceneWrapper>

        {/* <SectionDivider variant="gradient" /> */}

        <SceneWrapper disabled={disableScrollScenes} variant="flow">
          <AboutSection />
        </SceneWrapper>

        {/* <SectionDivider variant="dots" /> */}

        <SceneWrapper disabled={disableScrollScenes} variant="flow">
          <TestimonialsSection />
        </SceneWrapper>

        {/* <SectionDivider variant="wave" /> */}

        <SceneWrapper disabled={disableScrollScenes} variant="flow">
          <FAQSection />
        </SceneWrapper>

        {/* <SectionDivider variant="gradient" /> */}

        <SceneWrapper disabled={disableScrollScenes} variant="portal">
          <ContactSection />
        </SceneWrapper>
      </main>

      <Footer />
      <ScrollToTop />
    </>
  )
}
