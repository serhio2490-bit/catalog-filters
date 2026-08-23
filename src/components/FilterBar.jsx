import Icon from "./Icon";

// Панель фильтров. Кнопки — это настоящие <button> с aria-pressed,
// поэтому фильтр работает и с клавиатуры, и в программе чтения с экрана.

export default function FilterBar({ categories, counts, active, onChange }) {
  const items = [{ id: "all", title: "Все", icon: null }, ...categories];

  return (
    <div
      role="group"
      aria-label="Фильтр услуг по категориям"
      className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3"
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
              "inline-flex min-h-11 items-center justify-center gap-2 rounded-control border px-3.5 py-2.5 sm:justify-start sm:px-4",
              item.id === "all" ? "col-span-2 sm:col-auto" : "",
              "text-body font-medium transition duration-200 ease-out",
              "hover:-translate-y-0.5 active:translate-y-0",
              isActive
                ? "border-accent bg-accent text-white shadow-lift hover:bg-accent-strong"
                : "border-line bg-surface text-ink shadow-soft hover:border-accent/40 hover:text-accent",
            ].join(" ")}
          >
            {item.id !== "all" && (
              <Icon
                name={item.id}
                className={[
                  "h-5 w-5 shrink-0",
                  isActive ? "text-white" : "text-accent",
                ].join(" ")}
              />
            )}
            <span>{item.title}</span>
            <span
              className={[
                "rounded-full px-2 py-0.5 text-small font-semibold tabular-nums",
                isActive
                  ? "bg-accent-strong text-white"
                  : "bg-accent-soft text-accent",
              ].join(" ")}
            >
              {counts[item.id] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
