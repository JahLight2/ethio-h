type Props = { size?: number; className?: string; style?: React.CSSProperties }

/** The brand's four-point star, drawn. Used in the wordmark, badge and confirmation. */
export function Sparkle({ size = 18, className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 0c.55 4.9 1.9 7.9 4.1 9.6C18.1 11.1 20.6 11.8 24 12c-3.4.2-5.9.9-7.9 2.4C13.9 16.1 12.55 19.1 12 24c-.55-4.9-1.9-7.9-4.1-9.6C5.9 12.9 3.4 12.2 0 12c3.4-.2 5.9-.9 7.9-2.4C10.1 7.9 11.45 4.9 12 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Star with a soft overshoot, for the confirmation. */
export function SparklePop({ size = 22, delay = 0, className, style }: Props & { delay?: number }) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        animation: `sparkle-pop .5s cubic-bezier(.22,1,.36,1) ${delay}ms both`,
        ...style,
      }}
    >
      <Sparkle size={size} />
    </span>
  )
}
