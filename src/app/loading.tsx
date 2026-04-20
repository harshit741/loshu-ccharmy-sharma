import Image from 'next/image'

export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: 'var(--color-bg)' }}
      role="status"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full border-2 animate-spin"
            style={{ borderColor: 'transparent', borderTopColor: 'var(--color-rose)' }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-2 rounded-full border-2 animate-spin"
            style={{
              borderColor: 'transparent',
              borderTopColor: 'var(--color-teal)',
              animationDirection: 'reverse',
              animationDuration: '1.5s',
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="flex h-11 w-11 items-center justify-center rounded-full dark:bg-white dark:p-1">
              <Image
                src="/logo.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </span>
          </div>
        </div>

        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Loading...
        </p>
      </div>
    </div>
  )
}
