"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { demoProducts } from "@/data/demo-products";

const questions = [
  {
    title: "Что хочется почувствовать после ухода?",
    options: [
      ["hydration", "Больше увлажнённости"],
      ["balance", "Лёгкость и баланс"],
      ["comfort", "Комфорт и спокойствие"],
    ],
  },
  {
    title: "Какой ритм вам ближе?",
    options: [
      ["minimal", "Несколько простых шагов"],
      ["layered", "Полный многослойный ритуал"],
      ["flexible", "По настроению"],
    ],
  },
  {
    title: "Какие текстуры нравятся больше?",
    options: [
      ["light", "Лёгкие и быстро впитывающиеся"],
      ["rich", "Более плотные и насыщенные"],
      ["both", "Любые, если коже комфортно"],
    ],
  },
] as const;

const recommendationIds = {
  hydration: ["best-02", "best-03", "face-01"],
  balance: ["best-02", "face-02", "best-03"],
  comfort: ["best-03", "face-01", "new-02"],
} as const;

export default function RitualPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const recommendations = useMemo(() => {
    const focus = answers[0] as keyof typeof recommendationIds | undefined;
    const ids = recommendationIds[focus ?? "hydration"];
    return ids.map((id) => demoProducts.find((product) => product.id === id)).filter(Boolean);
  }, [answers]);

  const choose = (value: string) => {
    const nextAnswers = [...answers];
    nextAnswers[step] = value;
    setAnswers(nextAnswers);
    setStep((current) => Math.min(current + 1, questions.length));
  };

  const reset = () => {
    setAnswers([]);
    setStep(0);
  };

  return (
    <main className="ritual-page">
      <header className="ritual-header">
        <Link className="brand-mark" href="/" aria-label="KANSO — на главную">KANSO</Link>
        <Link className="catalog-back-link" href="/">Вернуться в магазин</Link>
      </header>
      <section className="ritual-content" aria-labelledby="ritual-title">
        <div className="ritual-intro">
          <p className="micro-label">Личный подбор</p>
          <h1 id="ritual-title">Найдите свой ритуал</h1>
          <p>Три коротких вопроса помогут собрать уход под ваш ритм и предпочтения.</p>
          <div className="ritual-progress" aria-label={`Шаг ${Math.min(step + 1, questions.length)} из ${questions.length}`}>
            {questions.map((_, index) => <span className={index <= step ? "is-active" : ""} key={index} />)}
          </div>
        </div>

        {step < questions.length ? (
          <div className="ritual-question" key={step}>
            <p className="micro-label">Вопрос {step + 1} / {questions.length}</p>
            <h2>{questions[step].title}</h2>
            <div className="ritual-options">
              {questions[step].options.map(([value, label]) => (
                <button type="button" className={answers[step] === value ? "is-selected" : ""} onClick={() => choose(value)} key={value}>{label}<span aria-hidden="true">↗</span></button>
              ))}
            </div>
          </div>
        ) : (
          <div className="ritual-result">
            <div className="ritual-result-heading">
              <p className="micro-label">Ваша подборка</p>
              <h2>Начните с этих средств</h2>
              <p>Собрали спокойную основу, которую можно адаптировать под ваш ежедневный ритм.</p>
            </div>
            <div className="ritual-products">
              {recommendations.map((product) => product && (
                <Link href={`/product/${product.id}`} className="ritual-product" key={product.id}>
                  <div className="ritual-product-image"><Image src={product.image} alt={product.name} fill sizes="(max-width: 767px) 80vw, 28vw" /></div>
                  <span className="micro-label">{product.brand}</span>
                  <h3>{product.name}</h3>
                  <span className="ritual-product-link">Посмотреть средство ↗</span>
                </Link>
              ))}
            </div>
            <div className="ritual-actions"><Link className="button button-dark" href="/catalog?focus=hydration"><span className="button-arrow" aria-hidden="true">↘</span><span className="button-label">Открыть подборку</span></Link><button type="button" className="text-link" onClick={reset}>Пройти заново</button></div>
          </div>
        )}
      </section>
    </main>
  );
}
