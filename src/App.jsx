import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { categories, services } from "./data/services";
import FilterBar from "./components/FilterBar";
import ServiceCard from "./components/ServiceCard";
import ServiceModal from "./components/ServiceModal";

const VALID_IDS = ["all", ...categories.map((category) => category.id)];
const REVEAL_LEAD = ["Бытовой", "сервис"];
const REVEAL_TAIL = ["для", "дома", "и", "квартиры"];

// Выбранная категория попадает в адрес страницы: ссылкой можно поделиться
// сразу на нужный раздел, и кнопка «назад» в браузере работает как ожидается.
function readCategoryFromUrl() {
  const value = new URLSearchParams(window.location.search).get("category");
  return VALID_IDS.includes(value) ? value : "all";
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function App() {
  const [active, setActive] = useState(readCategoryFromUrl);
  const [openedService, setOpenedService] = useState(null);

  // Приём FLIP: перед сменой фильтра запоминаем, где карточки лежали,
  // после перерисовки сдвигаем их обратно и отпускаем. Карточка, которая
  // осталась в списке, именно переезжает на новое место, а не исчезает
  // и появляется заново.
  const cardRefs = useRef(new Map());
  const prevRects = useRef(null);
  const knownIds = useRef(null);

  const setCardRef = useCallback(
    (id) => (element) => {
      if (element) cardRefs.current.set(id, element);
      else cardRefs.current.delete(id);
    },
    [],
  );

  useEffect(() => {
    const onPopState = () => setActive(readCategoryFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const changeCategory = useCallback((id) => {
    const rects = new Map();
    for (const [key, element] of cardRefs.current) {
      if (element) rects.set(key, element.getBoundingClientRect());
    }
    prevRects.current = rects;

    setActive(id);

    const url = new URL(window.location.href);
    if (id === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", id);
    window.history.pushState({}, "", url);
  }, []);

  const counts = useMemo(() => {
    const result = { all: services.length };
    for (const category of categories) {
      result[category.id] = services.filter(
        (service) => service.category === category.id,
      ).length;
    }
    return result;
  }, []);

  const titleByCategory = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [category.id, category.title]),
      ),
    [],
  );

  // Минимальная цена считается по самим услугам, а не вписана руками:
  // добавите услугу дешевле — число в шапке обновится само.
  const minPrice = useMemo(() => {
    const numbers = services
      .map((service) => Number(service.price.replace(/\D/g, "")))
      .filter((value) => Number.isFinite(value) && value > 0);
    return new Intl.NumberFormat("ru-RU").format(Math.min(...numbers));
  }, []);

  const visible = useMemo(
    () =>
      active === "all"
        ? services
        : services.filter((service) => service.category === active),
    [active],
  );

  const [featured, ...rest] = visible;

  // Какие карточки в этом списке новые — им достаётся появление,
  // остальные переезжают приёмом FLIP.
  const freshIds = useMemo(() => {
    if (knownIds.current === null) return new Set(rest.map((s) => s.id));
    return new Set(
      rest.map((s) => s.id).filter((id) => !knownIds.current.has(id)),
    );
  }, [rest]);

  useLayoutEffect(() => {
    const previous = prevRects.current;
    knownIds.current = new Set(rest.map((service) => service.id));
    prevRects.current = null;

    if (!previous || prefersReducedMotion()) return;

    for (const [key, element] of cardRefs.current) {
      const before = previous.get(key);
      if (!before || !element) continue;

      const after = element.getBoundingClientRect();
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      if (!dx && !dy) continue;

      element.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
        { duration: 420, easing: "cubic-bezier(0.22, 0.68, 0.35, 1)" },
      );
    }
  }, [active, rest]);

  return (
    <div className="min-h-dvh">
      <div
        aria-hidden="true"
        className="bg-room"
        style={{
          "--bg-room": `url(${import.meta.env.BASE_URL}img/bg-room.webp)`,
        }}
      />
      <main className="mx-auto w-full max-w-[78rem] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        {/* Шапка асимметричная: текст занимает пять колонок из двенадцати,
            заглавная карточка — семь. Ровной симметрии нет нигде. */}
        <section className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col justify-center lg:col-span-5">
            <h1 className="max-w-[13ch] text-h1 font-semibold">
              {REVEAL_LEAD.map((word, index) => (
                <span key={word}>
                  <span className="reveal-word" style={{ "--i": index }}>
                    {word}
                  </span>{" "}
                </span>
              ))}
              <span className="block font-normal text-muted">
                {REVEAL_TAIL.map((word, index) => (
                  <span key={word}>
                    <span
                      className="reveal-word"
                      style={{ "--i": index + REVEAL_LEAD.length }}
                    >
                      {word}
                    </span>{" "}
                  </span>
                ))}
              </span>
            </h1>

            <p className="mt-6 max-w-[38ch] leading-relaxed text-muted">
              Выберите раздел — список перестроится сразу, без перезагрузки
              страницы. Нажмите «Что входит», чтобы увидеть подробности.
            </p>

            <dl className="mt-8 flex flex-wrap gap-8">
              <div>
                <dt className="sr-only">Услуг в каталоге</dt>
                <dd className="font-display text-h3 font-semibold tracking-[-0.02em] text-accent-deep tabular-nums">
                  {services.length}
                </dd>
                <p className="text-small text-muted">услуг в каталоге</p>
              </div>
              <div>
                <dt className="sr-only">Разделов</dt>
                <dd className="font-display text-h3 font-semibold tracking-[-0.02em] text-accent-deep tabular-nums">
                  {categories.length}
                </dd>
                <p className="text-small text-muted">раздела</p>
              </div>
              <div>
                <dt className="sr-only">Минимальный заказ</dt>
                <dd className="font-display text-h3 font-semibold tracking-[-0.02em] text-accent-deep tabular-nums">
                  от {minPrice} ₽
                </dd>
                <p className="text-small text-muted">минимальный заказ</p>
              </div>
            </dl>
          </div>

          {featured && (
            <article
              key={featured.id}
              className="appear group relative isolate flex min-h-[21rem] items-end overflow-hidden rounded-card shadow-card lg:col-span-7"
            >
              <img
                src={`${import.meta.env.BASE_URL}img/${featured.image}`}
                alt={featured.alt}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[600ms] ease-soft group-hover:scale-[1.035]"
              />
              {/* Плотная вуаль снизу: без неё текст не читается на светлой
                  части снимка. Сверху вуаль почти прозрачная. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-scrim/92 via-scrim/62 via-52% to-transparent to-88%"
              />

              <div className="w-full p-6 text-white sm:p-8">
                <span className="text-small font-semibold tracking-[0.05em] text-accent-soft">
                  {titleByCategory[featured.category]}
                </span>
                <h2 className="mt-3 max-w-[16ch] text-h2 font-bold text-white">
                  {featured.title}
                </h2>
                <p className="mt-2 max-w-[44ch] text-white/80">
                  {featured.short}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <span className="font-display text-h3 font-semibold tracking-[-0.02em] tabular-nums">
                    {featured.price}
                  </span>
                  <span className="text-small text-white/70">
                    {featured.duration}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenedService(featured)}
                    className="ml-auto inline-flex min-h-11 items-center rounded-control bg-white px-5 py-2.5 font-semibold whitespace-nowrap text-ink transition-colors duration-200 ease-soft hover:bg-accent-soft hover:text-accent-deep"
                  >
                    Что входит
                  </button>
                </div>
              </div>
            </article>
          )}
        </section>

        <div className="mt-12">
          <FilterBar
            categories={categories}
            counts={counts}
            active={active}
            onChange={changeCategory}
          />
        </div>

        <p aria-live="polite" className="mt-6 text-small text-muted">
          Показано {visible.length} из {services.length} услуг
        </p>

        {rest.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((service, index) => (
              <ServiceCard
                key={service.id}
                ref={setCardRef(service.id)}
                service={service}
                categoryTitle={titleByCategory[service.category]}
                onOpen={setOpenedService}
                isNew={freshIds.has(service.id)}
                index={index}
              />
            ))}
          </div>
        ) : (
          !featured && (
            <p className="mt-4 rounded-card border border-dashed border-line bg-surface p-10 text-center text-muted">
              В этой категории пока нет услуг.
            </p>
          )
        )}

        <footer className="mt-20 border-t border-line pt-8 text-small text-muted">
          Демо-модуль: панель фильтров и сетка карточек. React + Vite +
          Tailwind. Все услуги описаны в одном файле{" "}
          <code className="rounded bg-accent-soft px-1.5 py-0.5 font-semibold text-accent-deep">
            src/data/services.js
          </code>{" "}
          — добавить новую можно без программиста.
        </footer>
      </main>

      <ServiceModal
        service={openedService}
        categoryTitle={
          openedService ? titleByCategory[openedService.category] : ""
        }
        onClose={() => setOpenedService(null)}
      />
    </div>
  );
}
