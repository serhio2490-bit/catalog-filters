// Иконки нарисованы кодом (SVG), одной толщиной линии и в одном стиле.
// Сторонних наборов и картинок из стоков в проекте нет.

const paths = {
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
