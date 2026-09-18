import { useEffect, useRef } from "react";
import Icon from "./Icon";

// Окно «Что входит». Закрывается по Esc, по клику вне и кнопкой.
// Пока окно открыто, Tab не убегает на страницу под ним, а фон не прокручивается.
// Сверху — снимок услуги, под ним подробное описание и список работ.

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
      className="fixed inset-0 z-50 flex items-end justify-center bg-scrim/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        className="appear max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-card bg-surface shadow-modal sm:rounded-card"
      >
        {/* Снимок и заголовок поверх него — текст лежит на плотной вуали,
            иначе по светлой части фотографии его не прочитать. */}
        <div className="relative isolate">
          <img
            src={`${import.meta.env.BASE_URL}img/${service.image}`}
            alt={service.alt}
            className="h-44 w-full object-cover sm:h-56"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-scrim/92 via-scrim/45 via-50% to-transparent to-85%"
          />

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-control border border-white/30 bg-scrim/40 text-white backdrop-blur-sm transition-colors duration-200 ease-soft hover:border-white hover:bg-scrim/70"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>

          <div className="absolute inset-x-0 bottom-0 p-6">
            <span className="text-small font-semibold tracking-[0.05em] text-accent-soft">
              {categoryTitle}
            </span>
            <h2
              id="service-modal-title"
              className="mt-2 text-h2 font-semibold text-white"
            >
              {service.title}
            </h2>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="max-w-[58ch] text-lead leading-relaxed text-muted">
            {service.full}
          </p>

          <h3 className="mt-8 text-h3 font-bold">Что входит в цену</h3>
          <ul className="mt-4 space-y-3">
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
              <div className="font-display text-h2 font-semibold tracking-[-0.02em] tabular-nums">
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
              className="inline-flex min-h-11 items-center rounded-control bg-accent px-6 py-3 font-semibold text-on-accent transition-colors duration-200 ease-soft hover:bg-accent-deep"
            >
              Понятно
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
