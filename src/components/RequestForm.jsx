import { useId, useState } from "react";
import Icon from "./Icon";

// Форма заявки по требованиям 152-ФЗ.
//
// Три вещи, в которых чаще всего ошибаются:
// 1. Галочка согласия НЕ стоит заранее — предзаполненная согласием не считается.
// 2. Ссылка на условия вынесена ЗА пределы <label>. Внутри метки любой клик по
//    ссылке переключал бы чекбокс, и посетитель снимал бы согласие, сам того не
//    заметив.
// 3. Согласие на обработку и согласие на рассылку — разные вещи; здесь только
//    первое, галочки на рассылку нет вовсе.
//
// Это демо: заявка никуда не уходит и нигде не сохраняется. На рабочем сайте
// первичная запись обязана попадать на российский хостинг.

export default function RequestForm({ serviceTitle, onShowTerms }) {
  const nameId = useId();
  const phoneId = useId();
  const consentId = useId();
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="mt-8 rounded-card border border-accent/30 bg-accent-soft p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent">
            <Icon name="check" className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-lead font-bold text-accent-deep">
              Заявка принята
            </h3>
            <p className="mt-2 text-small leading-relaxed text-muted">
              Так это выглядит для посетителя. В демо заявка никуда не
              отправляется и нигде не сохраняется — показан только сценарий.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      className="mt-8 rounded-card border border-line bg-paper p-5 sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <h3 className="text-h3 font-bold">Оставить заявку</h3>
      <p className="mt-2 text-small leading-relaxed text-muted">
        Услуга: {serviceTitle}. Перезвоним, уточним детали и назовём точную цену
        до начала работ.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={nameId} className="text-small font-semibold">
            Как к вам обращаться
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Имя"
            className="mt-2 min-h-11 w-full rounded-control border border-line bg-surface px-4 py-2.5 transition-colors duration-200 ease-soft placeholder:text-muted/60 hover:border-accent/50 focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor={phoneId} className="text-small font-semibold">
            Телефон
          </label>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 900 000-00-00"
            className="mt-2 min-h-11 w-full rounded-control border border-line bg-surface px-4 py-2.5 transition-colors duration-200 ease-soft placeholder:text-muted/60 hover:border-accent/50 focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Галочка не предзаполнена, ссылка на условия — соседним элементом,
          а не внутри метки. */}
      <div className="mt-5 flex items-start gap-3">
        <input
          id={consentId}
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-5 w-5 shrink-0 accent-accent"
        />
        <p className="text-small leading-relaxed text-muted">
          <label htmlFor={consentId}>
            Согласен на обработку персональных данных
          </label>{" "}
          <button
            type="button"
            onClick={onShowTerms}
            className="inline-block py-2 font-semibold text-accent underline underline-offset-2 hover:text-accent-deep"
          >
            Условия обработки
          </button>
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-control bg-accent px-6 py-3 font-semibold text-on-accent transition-colors duration-200 ease-soft hover:bg-accent-deep"
        >
          Вызвать мастера
        </button>
        <p className="text-small text-muted">
          Демо: заявка никуда не отправляется
        </p>
      </div>
    </form>
  );
}
