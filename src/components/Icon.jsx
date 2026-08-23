// Иконки нарисованы кодом (SVG), одной толщиной линии и в одном стиле.
// Сторонних наборов и картинок из стоков в проекте нет.

const paths = {
  repair: (
    <>
      <path d="M20.4 7.6a4.9 4.9 0 0 1-6.2 6.2l-6 6a2.1 2.1 0 0 1-3-3l6-6a4.9 4.9 0 0 1 6.2-6.2l-2.7 2.7.9 2.8 2.8.9 2-3.4z" />
      <path d="M6.9 18.4h.01" />
    </>
  ),
  cleaning: (
    <>
      <path d="M10 8V5.6A1.6 1.6 0 0 1 11.6 4h1A1.6 1.6 0 0 1 14.2 5.6V8" />
      <path d="M9 20.6v-8.4A3.2 3.2 0 0 1 12.2 9a3.2 3.2 0 0 1 3.2 3.2v8.4z" />
      <path d="M14.2 6h3l2.2-2.2" />
      <path d="M9.6 13.4h5.2" />
    </>
  ),
  appliances: (
    <>
      <rect x="4.2" y="3.2" width="15.6" height="17.6" rx="2.6" />
      <circle cx="12" cy="14" r="4" />
      <path d="M7.6 7h2.2" />
      <path d="M16.2 7h.01" />
    </>
  ),
  removal: (
    <>
      <path d="M3 8.2A1.6 1.6 0 0 1 4.6 6.6h7.8a1.6 1.6 0 0 1 1.6 1.6v8.6H3z" />
      <path d="M14 10.8h3.3a2 2 0 0 1 1.7 1l2 3.3v1.7h-7z" />
      <circle cx="7.2" cy="18.4" r="1.7" />
      <circle cx="17.4" cy="18.4" r="1.7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4V12l3 1.8" />
    </>
  ),
  check: <path d="M4.8 12.6 9.6 17.4l9.6-10.8" />,
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
};

export default function Icon({ name, className = "" }) {
  const shape = paths[name];
  if (!shape) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {shape}
    </svg>
  );
}
