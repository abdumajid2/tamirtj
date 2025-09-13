// src/components/sections/HowItWorks.jsx
"use client";
import Image from "next/image";
import React from "react";

export default function HowItWorks() {
  const cards = [
    {
      title: "Удобный поиск",
      text:
        "Используйте фильтр, чтобы найти проверенного специалиста в своем городе и даже районе. Контакты всегда под рукой!",
      icon: MapIcon,
    },
    {
      title: "Отзывы и рейтинг",
      text:
        "Доверяйте мнению других! Читайте реальные отзывы, смотрите рейтинг мастеров и сами оценивайте работу специалиста.",
      icon: ReviewsIcon,
    },
    {
      title: "Оставьте заявку",
      text:
        "Заполните короткую форму, и мастера свяжутся с вами. Вам останется выбрать лучшее предложение и договориться о встрече!",
      icon: FormIcon,
    },
    {
      title: "Сравнивайте цены",
      text:
        "Не переплачивайте! Смотрите актуальные расценки и выбирайте подходящий вариант под ваш бюджет.",
      icon: BarsIcon,
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Как это работает
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ title, text, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl bg-white border border-gray-100 shadow-2xl shadow-blue-100/60 p-6 flex flex-col items-center gap-2 text-center transition-shadow hover:shadow-md duration-400 "
            >
              <div className="mb-4">
                <Icon />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}




function MapIcon() {
  return (
    
      <Image src={"/hero/undraw_global-team_8jok.svg"}
      alt=""
      width={170}
      height={100}
      className=""
      />
    
  );
}



function ReviewsIcon() {
  return (
    <Image src={"/hero/undraw_personal-settings_8xv3.svg"}
      alt=""
      width={170}
      height={100}
      className=""
      />
  );
}



function FormIcon() {
  return (
    <Image src={"/hero/undraw_responsive_csbt.svg"}
      alt=""
      width={170}
      height={100}
      className=""
      />
  );
}

function BarsIcon() {
  return (
    <Image src={"/hero/undraw_grades_hqyk.svg"}
      alt=""
      width={170}
      height={100}
      className=""
      />
  );
}
