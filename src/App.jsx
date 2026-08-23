import { useCallback, useEffect, useMemo, useState } from "react";
import { categories, services } from "./data/services";
import FilterBar from "./components/FilterBar";
import ServiceCard from "./components/ServiceCard";
import ServiceModal from "./components/ServiceModal";

const VALID_IDS = ["all", ...categories.map((category) => category.id)];

// Выбранная категория попадает в адрес страницы: ссылкой можно поделиться
// сразу на нужный раздел, и кнопка «назад» в браузере работает как ожидается.
function readCategoryFromUrl() {
  const value = new URLSearchParams(window.location.search).get("category");
  return VALID_IDS.includes(value) ? value : "all";
}

export default function App() {
  const [active, setActive] = useState(readCategoryFromUrl);
  const [openedService, setOpenedService] = useState(null);

  useEffect(() => {
    const onPopState = () => setActive(readCategoryFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const changeCategory = useCallback((id) => {
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

  const visible = useMemo(
    () =>
      active === "all"
        ? services
        : services.filter((service) => service.category === active),
    [active],
  );

  return (
    <div className="min-h-dvh">
      <main className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <header className="max-w-[46ch]">
          <p className="text-small font-semibold tracking-[0.08em] text-accent uppercase">
            Каталог услуг
          </p>
          <h1 className="mt-4 text-h1 font-extrabold">
            Бытовой сервис для дома и квартиры
          </h1>
          <p className="mt-5 max-w-[54ch] text-lead text-muted">
            Выберите категорию — список обновится сразу, без перезагрузки
            страницы. Нажмите «Подробнее», чтобы увидеть, что входит в услугу.
          </p>
        </header>

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

        {visible.length > 0 ? (
          <div
            key={active}
            className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                categoryTitle={titleByCategory[service.category]}
                onOpen={setOpenedService}
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-card border border-dashed border-line bg-surface p-10 text-center text-muted">
            В этой категории пока нет услуг.
          </p>
        )}

        <footer className="mt-20 border-t border-line pt-8 text-small text-muted">
          Демо-модуль: панель фильтров и сетка карточек. React + Vite +
          Tailwind. Все услуги описаны в одном файле{" "}
          <code className="rounded bg-accent-soft px-1.5 py-0.5 font-semibold text-accent">
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
