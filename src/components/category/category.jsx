import { Building2, Car, WashingMachine } from "lucide-react";
import React from "react";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";

const Category = () => {
  return (
    <React.Fragment>
      <main className="mt-20">
        <article className="flex relative">
          <h2 className="text-4xl font-semibold">
            Более 80 категорий услуг, сотни специалистов в каталоге, удобный
            поиск и быстрый отклик
          </h2>
        </article>
        <section className="mt-14 flex justify-between">
          <article className="flex flex-col justify-around h-[320px] w-[285px] rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
            <Building2 className="text-[#00B140] text-2xl w-8 h-8" />
            <h3 className="text-lg font-bold">Строй</h3>
            <div className="text-gray-600 flex flex-wrap gap-4 text-[11px]">
              <p className="border border-gray-600 p-2 rounded-full">
                Сантехники
              </p>
              <p className="border border-gray-600 p-2 rounded-full">
                Электрики
              </p>
              <p className="border border-gray-600 p-2 rounded-full">
                Мальяры-штукатуры
              </p>
            </div>
          </article>
          <article className="flex flex-col justify-around h-[320px] w-[285px] rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
            <Car className="text-red-500 text-2xl w-8 h-8" />
            <h3 className="text-lg font-bold">Авто</h3>
            <div className="text-gray-600 flex flex-wrap gap-4 text-[11px]">
              <p className="border border-gray-600 p-2 rounded-full">
                Вызов мастера на место
              </p>
              <p className="border border-gray-600 p-2 rounded-full">
                Автоэлектрики
              </p>
              <p className="border border-gray-600 p-2 rounded-full">
                Ремонт АКПП МКПП
              </p>
            </div>
          </article>
          <article className="flex flex-col justify-around h-[320px] w-[285px] rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
            <WashingMachine className="text-blue-500 text-2xl w-8 h-8" />
            <h3 className="text-lg font-bold">Техника</h3>
            <div className="text-gray-600 flex flex-wrap gap-4 text-[11px]">
              <p className="border border-gray-600 p-2 rounded-full">
                Кондиционеры
              </p>
              <p className="border border-gray-600 p-2 rounded-full">
                Стиральные машины
              </p>
              <p className="border border-gray-600 p-2 rounded-full">
                Холодильники
              </p>
            </div>
          </article>
          <article className="flex flex-col justify-around h-[320px] w-[285px] rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
            <HiMiniWrenchScrewdriver className="text-orange-500 text-2xl w-8 h-8" />
            <h3 className="text-lg font-bold">Бытовые услуги</h3>
            <div className="text-gray-600 flex flex-wrap gap-4 text-[11px]">
              <p className="border border-gray-600 p-2 rounded-full">
                Уборка квартиры
              </p>
              <p className="border border-gray-600 p-2 rounded-full">
                Ремонт сумок
              </p>
              <p className="border border-gray-600 p-2 rounded-full">
                Ремонт часов
              </p>
            </div>
          </article>
        </section>
        <section className="mt-14 flex flex-col gap-7 items-center   ">
          <h2 className="text-3xl font-semibold text-center">
            Прямые контакты проверенных мастеров от Ташкента до Хорезма!
            Выбирайте специалиста по отзывам, фото работ и стоимости.
          </h2>
          <article className="flex gap-8 items-center">
            <button className="bg-[#00B140] text-white px-8 py-3 rounded-full shadow-md hover:shadow-xl transition-shadow duration-300">
              Вызвать мастера
            </button>
            <button className="flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-full shadow-md hover:shadow-xl transition-shadow duration-300 group">
              <p>Перейти в каталог</p>
              <svg
                className="w-4 h-4 text-[#00B140] transition-transform group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </article>
        </section>
      </main>
    </React.Fragment>
  );
};

export default Category;
