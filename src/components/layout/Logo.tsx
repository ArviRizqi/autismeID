export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M24 24c-3-6-6-9-10-9a9 9 0 0 0 0 18c4 0 7-3 10-9z"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 24c3 6 6 9 10 9a9 9 0 0 0 0-18c-4 0-7 3-10 9z"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
