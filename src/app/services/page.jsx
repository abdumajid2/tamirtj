import HeroSpotlight from '@/components/hero/HeroSpotlight'
import ServicesCatalog from '@/components/sections/servTamir'
import ServicesUstabor from '@/components/sections/servTamir'
import React from 'react'

const ServicePage = () => {
  return (
    <div>
        <main>
            <HeroSpotlight
          slides={[
            {
              src: "/hero/slide-1.jpg",
              alt: "Соседи и ремонт",
              badge: "Советы по ремонту",
              title: "Ремонт у соседей: в какое время нельзя шуметь?",
              ctaText: "Читать дальше",
              ctaHref: "/blog/noise",
            },
            {
              src: "/hero/slide-2.jpg",
              alt: "Оплата отопления",
              badge: "ЖКХ",
              title:
                "Новый порядок оплаты за отопление: надо ли платить за отопление, которого не было?",
              ctaText: "Подробнее",
              ctaHref: "/blog/heating",
            },
            {
              src: "/hero/slide-3.jpg",
              alt: "Кредит Душанбе",
              badge: "Ипотека",
              title: "Купить квартиру в кредит в Душанбе",
              ctaText: "Узнать условия",
              ctaHref: "/mortgage",
            },
            {
              src: "/hero/slide-4.jpg",
              alt: "Художественная ковка",
              badge: "Интерьер",
              title:
                "Художественная ковка — выразительный акцент с творческим почерком",
              ctaText: "Смотреть идеи",
              ctaHref: "/forging",
            },
            {
              src: "/hero/slide-5.jpg",
              alt: "Usta модернизация",
              badge: "Usta",
              title: "Потрясло?! Это Ustaмодернизация!",
              ctaText: "Что нового",
              ctaHref: "/usta-modern",
            },
            {
              src: "/hero/slide-6.jpg",
              alt: "Осторожно мошенники",
              badge: "Безопасность",
              title: "Осторожно мошенники!",
              ctaText: "Как защититься",
              ctaHref: "/safety",
            },
          ]}
        />
        </main>
        <section>
          <ServicesCatalog/>
        </section>
    </div>
  )
}

export default ServicePage