// Панель фильтров. Кнопки — это настоящие <button> с aria-pressed,
// поэтому фильтр работает и с клавиатуры, и в программе чтения с экрана.
// Сигнал наведения один: меняется цвет рамки и подписи, ничего не прыгает.

export default function FilterBar({ categories, counts, active, onChange }) {
  const items = [{ id: "all", title: "Все" }, ...categories];

  return (
    <div
      role="group"
      aria-label="Фильтр услуг по категориям"
      className="flex flex-wrap gap-2 border-b border-line pb-6"
    >
      {items.map((item) => {
        const isActive = item.id === active;

        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(item.id)}
            className={[
              "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 whitespace-nowrap",
              "transition-colors duration-200 ease-soft",
              isActive
                ? "border-accent bg-accent font-semibold text-on-accent"
                : "border-line bg-surface font-medium text-ink hover:border-accent hover:text-accent",
            ].join(" ")}
          >
            <span>{item.title}</span>
            <sup
              className={`text-[0.72em] tabular-nums ${
                isActive ? "text-on-accent/70" : "text-muted"
              }`}
            >
              {counts[item.id] ?? 0}
            </sup>
          </button>
        );
      })}
    </div>
  );
}
