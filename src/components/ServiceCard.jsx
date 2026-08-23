import Icon from "./Icon";

export default function ServiceCard({ service, categoryTitle, onOpen }) {
  return (
    <article className="appear flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-soft transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent">
          <Icon name={service.category} className="h-6 w-6" />
        </span>
        <span className="rounded-full bg-bg px-3 py-1 text-small font-medium text-muted">
          {categoryTitle}
        </span>
      </div>

      <h3 className="mt-5 text-h3 font-bold">{service.title}</h3>

      <p className="mt-2 max-w-[52ch] text-muted">{service.short}</p>

      <div className="mt-4 flex items-center gap-1.5 text-small text-muted">
        <Icon name="clock" className="h-4 w-4" />
        <span>{service.duration}</span>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <span className="text-h3 font-extrabold tabular-nums">
          {service.price}
        </span>
        <button
          type="button"
          onClick={() => onOpen(service)}
          className="inline-flex min-h-11 items-center rounded-control border border-line bg-surface px-4 py-2.5 font-medium text-accent transition duration-200 ease-out hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-white active:translate-y-0"
        >
          Подробнее
        </button>
      </div>
    </article>
  );
}
