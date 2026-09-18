import { forwardRef } from "react";

// Карточку ведёт снимок: его пропорция задаёт высоту, а не наоборот.
// Из-за разных пропорций ряды получаются неровными — сетка перестаёт
// выглядеть таблицей. При наведении работает ровно один сигнал:
// снимок чуть приближается, рамка темнеет.

const ServiceCard = forwardRef(function ServiceCard(
  { service, categoryTitle, onOpen, isNew, index },
  ref,
) {
  return (
    <article
      ref={ref}
      className={`group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-[border-color,box-shadow] duration-200 ease-soft hover:border-muted/40 hover:shadow-card ${
        isNew ? "appear" : ""
      }`}
      style={
        isNew ? { animationDelay: `${Math.min(index, 8) * 35}ms` } : undefined
      }
    >
      <img
        src={`${import.meta.env.BASE_URL}img/${service.image}`}
        alt={service.alt}
        loading={index < 3 ? "eager" : "lazy"}
        decoding="async"
        style={{ aspectRatio: service.ratio }}
        className="w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.04]"
      />

      <div className="flex flex-1 flex-col p-5">
        <span className="text-small font-semibold tracking-[0.03em] text-accent">
          {categoryTitle}
        </span>

        <h3 className="mt-2 text-lead font-bold">{service.title}</h3>

        <p className="mt-2 max-w-[46ch] text-small leading-relaxed text-muted">
          {service.short}
        </p>

        <div className="mt-auto flex items-baseline justify-between gap-3 pt-4">
          <span className="font-display text-lead font-semibold tracking-[-0.02em] tabular-nums">
            {service.price}
          </span>
          <span className="text-small text-muted">{service.duration}</span>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => onOpen(service)}
            className="tap-44 border-b-[1.5px] border-transparent py-2 text-small font-semibold text-accent transition-colors duration-200 ease-soft hover:border-current"
          >
            Что входит
          </button>
        </div>
      </div>
    </article>
  );
});

export default ServiceCard;
