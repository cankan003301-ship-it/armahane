export function LogoMark({ className = "mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 2L36 8V19C36 28 29 35 20 38 11 35 4 28 4 19V8Z" fill="#c8452c" />
      <path d="M20 6L32 10.5V19C32 26 27 31.5 20 34 13 31.5 8 26 8 19V10.5Z" fill="none" stroke="#f6f1e7" strokeWidth="1.4" strokeDasharray="2.4 1.8" />
      <path d="M13 26L20 12 27 26M15.8 21H24.2" fill="none" stroke="#f6f1e7" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
