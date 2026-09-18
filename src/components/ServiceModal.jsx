import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Icon from "./Icon";
import RequestForm from "./RequestForm";

// Окно «Что входит». Закрывается по Esc, по клику вне и кнопкой.
// Пока окно открыто, Tab не убегает на страницу под ним, а фон не прокручивается.
// Сверху — снимок услуги, под ним подробное описание и список работ.

export default function ServiceModal({ service, categoryTitle, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const termsRef = useRef(null);
  const [termsOpen, setTermsOpen] = useState(false);

  // Окно переиспользуется под разные услуги: панель условий не должна
  // оставаться раскрытой от предыдущей.
  useEffect(() => setTermsOpen(false), [service]);

  // Раскрытую панель подкручиваем в поле зрения — иначе она уезжает
  // за нижний край, и кажется, что нажатие ничего не сделало.
  useLayoutEffect(() => {
    if (termsOpen) termsRef.current?.scrollIntoView({ block: "nearest" });
  }, [termsOpen]);

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
          </div>

          <RequestForm
            serviceTitle={service.title}
            onShowTerms={() => setTermsOpen((open) => !open)}
          />

          {/* Условия раскрываются здесь же, а не вторым окном: вложенные
              окна ломают ловушку фокуса и путают программы чтения с экрана. */}
          {termsOpen && (
            <section
              ref={termsRef}
              aria-label="Условия обработки персональных данных"
              className="appear mt-4 rounded-card border border-line bg-surface p-5 text-small leading-relaxed text-muted sm:p-6"
            >
              <h3 className="text-lead font-bold text-ink">
                Условия обработки персональных данных
              </h3>
              <p className="mt-3">
                Отправляя заявку, вы даёте согласие на обработку указанных вами
                имени и номера телефона. Данные используются только для того,
                чтобы связаться с вами по этой заявке, и не передаются третьим
                лицам для рекламы. Согласие отзывается письмом на адрес,
                указанный в реквизитах.
              </p>
              <p className="mt-3">
                Отдельного согласия на рассылку здесь нет — по закону это другое
                согласие, и его нельзя брать той же галочкой.
              </p>
              <p className="mt-3 rounded-control bg-paper p-3 text-ink">
                <strong className="font-semibold">Это демонстрация.</strong>{" "}
                Текст показывает структуру, а не заменяет документ. На рабочем
                сайте здесь стоит политика с реквизитами владельца, а заявка
                первично записывается на российский хостинг, как требует 152-ФЗ.
              </p>
              <button
                type="button"
                onClick={() => setTermsOpen(false)}
                className="mt-4 min-h-11 font-semibold text-accent underline underline-offset-2 hover:text-accent-deep"
              >
                Свернуть
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
