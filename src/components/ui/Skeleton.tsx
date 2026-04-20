import { cn } from '@/utils/cn'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function Skeleton({ className, width, height, rounded = 'lg' }: SkeletonProps) {
  const roundedMap = {
    sm:   'rounded',
    md:   'rounded-md',
    lg:   'rounded-lg',
    xl:   'rounded-xl',
    '2xl':'rounded-2xl',
    full: 'rounded-full',
  }

  return (
    <div
      className={cn(
        'shimmer-bg animate-pulse',
        roundedMap[rounded],
        className
      )}
      style={{
        width,
        height,
        backgroundColor: 'var(--color-border)',
      }}
      aria-hidden="true"
      role="presentation"
    />
  )
}

// Preset skeleton layouts
export function CardSkeleton() {
  return (
    <div
      className="p-6 rounded-3xl space-y-4"
      style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
      aria-label="Loading content"
    >
      <Skeleton height={20} width="60%" />
      <Skeleton height={14} width="100%" />
      <Skeleton height={14} width="80%" />
      <Skeleton height={14} width="90%" />
      <Skeleton height={40} rounded="xl" />
    </div>
  )
}

export function PackageCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="p-8 rounded-3xl space-y-5"
          style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        >
          <Skeleton height={12} width="30%" />
          <Skeleton height={28} width="70%" />
          <Skeleton height={40} width="50%" />
          <div className="space-y-2.5">
            {[1,2,3,4,5].map(j => <Skeleton key={j} height={14} width={`${70 + j * 4}%`} />)}
          </div>
          <Skeleton height={44} rounded="xl" />
        </div>
      ))}
    </div>
  )
}

export function TestimonialSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1,2,3,4,5,6].map(i => (
        <div
          key={i}
          className="p-6 rounded-3xl space-y-4"
          style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        >
          <div className="flex gap-1">
            {[1,2,3,4,5].map(j => <Skeleton key={j} width={14} height={14} rounded="sm" />)}
          </div>
          <Skeleton height={14} />
          <Skeleton height={14} width="90%" />
          <Skeleton height={14} width="75%" />
          <div className="flex justify-between items-center pt-2">
            <div className="space-y-1">
              <Skeleton height={14} width={80} />
              <Skeleton height={12} width={60} />
            </div>
            <Skeleton height={24} width={80} rounded="full" />
          </div>
        </div>
      ))}
    </div>
  )
}
