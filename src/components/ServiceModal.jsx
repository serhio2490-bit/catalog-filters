import { useEffect, useRef } from "react";
import Icon from "./Icon";

// Окно «Подробнее». Закрывается по Esc, по клику вне и кнопкой.
// Пока окно открыто, Tab не убегает на страницу под ним, а фон не прокручивается.

export default function ServiceModal({ service, categoryTitle, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!service) return undefined;

    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        className="appear max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-card bg-surface p-6 shadow-modal sm:rounded-card sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent">
              <Icon name={service.category} className="h-6 w-6" />
            </span>
            <span className="text-small font-medium text-muted">
              {categoryTitle}
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-line text-muted transition duration-200 ease-out hover:border-accent hover:text-accent"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        <h2 id="service-modal-title" className="mt-5 text-h2 font-extrabold">
          {service.title}
        </h2>

        <p className="mt-3 max-w-[58ch] text-lead leading-relaxed text-muted">
          {service.full}
        </p>

        <h3 className="mt-7 text-h3 font-bold">Что входит</h3>
        <ul className="mt-3 space-y-2.5">
          {service.includes.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Icon name="check" className="h-3.5 w-3.5" />
              </span>
              <span className="text-muted">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <div>
            <div className="text-h2 font-extrabold tabular-nums">
              {service.price}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-small text-muted">
              <Icon name="clock" className="h-4 w-4" />
              <span>Обычно занимает {service.duration}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center rounded-control bg-accent px-6 py-3 font-semibold text-white shadow-lift transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent-strong active:translate-y-0"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}
