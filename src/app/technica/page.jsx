// src/app/technica/page.jsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useGetMastersQuery } from '@/store/api/baseApi';
import {
  LuSnowflake, LuBadgeCheck, LuStar, LuPhone, LuSearch, LuFilter, LuCircleCheck
} from 'react-icons/lu';

const BRAND = { green: '#00B140', greenLight: '#E8F8EE', dark: '#111827' };

// Подкатегории «Кондиционеры»
const AC_SUBS = {
  51: 'Монтаж',
  52: 'Заправка',
  53: 'Диагностика',
};

function Stars({ rating = 0 }) {
  const full = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <LuStar key={i} className={i < full ? 'text-yellow-400' : 'text-gray-300'} />
      ))}
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-semibold">
      {children}
    </span>
  );
}

function MasterCard({ m }) {
  const subs = Array.isArray(m.subCategoryIds) ? m.subCategoryIds : [];
  return (
    <article className="bg-white rounded-[22px] border border-gray-100 shadow-[0_12px_40px_rgba(17,24,39,0.08)] overflow-hidden hover:shadow-[0_16px_48px_rgba(17,24,39,0.12)] transition-shadow">
      <div className="p-5 flex items-start gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
          <Image
            src={m.avatar || '/placeholder.png'}
            alt={m.fullName}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-gray-900 truncate">{m.fullName}</h3>
            {m.verified && <LuBadgeCheck className="text-green-500" title="Проверенный" />}
          </div>

          <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
            <Stars rating={m.rating} />
            <span className="text-gray-600">{Number(m.rating || 0).toFixed(1)}</span>
            <span>•</span>
            <span>{m.reviewsCount ?? 0} отзывов</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {subs.slice(0, 3).map((id) => (
              <Chip key={id}>{AC_SUBS[id] ?? `Услуга #${id}`}</Chip>
            ))}
            {subs.length > 3 && <Chip>+{subs.length - 3}</Chip>}
          </div>
        </div>

        <a
          href={`tel:${m.phone || ''}`}
          title={`Позвонить ${m.fullName}`}
          className="ml-auto w-10 h-10 rounded-full bg-[color:var(--brand-green)] text-white flex items-center justify-center hover:opacity-90"
          style={{ ['--brand-green']: BRAND.green }}
          aria-label="Позвонить"
          rel="nofollow"
        >
          <LuPhone className="text-xl" />
        </a>
      </div>

      <div className="px-5 pb-5">
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wide px-2.5 py-1 rounded-full text-white"
            style={{ background: BRAND.green }}
          >
            <LuSnowflake className="text-[14px]" />
            КОНДИЦИОНЕРЫ
          </span>

        <div className="text-sm text-gray-700">
            от{' '}
            <span className="font-extrabold">
              {Number(m.priceFrom ?? 0).toLocaleString('ru-RU')}
            </span>{' '}
            сомони
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
          <LuCircleCheck className="text-emerald-500" />
          Срочный выезд • Гарантия работ
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/masters/${m.id}`}
            className="text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            Подробнее →
          </Link>
          <button
            className="h-10 px-4 rounded-full text-white text-sm font-semibold hover:opacity-95 active:opacity-90"
            style={{ background: BRAND.green }}
          >
            Вызвать мастера
          </button>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-[22px] border border-gray-100 shadow-[0_12px_40px_rgba(17,24,39,0.08)] overflow-hidden bg-white animate-pulse">
      <div className="p-5 flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 bg-gray-100 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-100" />
      </div>
      <div className="px-5 pb-5 space-y-3">
        <div className="h-6 w-32 bg-gray-100 rounded-full" />
        <div className="h-4 w-1/3 bg-gray-100 rounded" />
        <div className="flex justify-between">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-10 w-32 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function TechnicaPage() {
  const [q, setQ] = useState('');
  const [activeSub, setActiveSub] = useState('all');

  // категория 5 — «Кондиционеры»
  const { data: masters = [], isLoading } = useGetMastersQuery({ categoryId: 5 });

  const filtered = useMemo(() => {
    let list = masters;
    if (activeSub !== 'all') {
      const subId = Number(activeSub);
      list = list.filter((m) => Array.isArray(m.subCategoryIds) && m.subCategoryIds.includes(subId));
    }
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = list.filter((m) => m.fullName.toLowerCase().includes(s));
    }
    return list;
  }, [masters, q, activeSub]);

  return (
    <section className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Шапка */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-2xl"
            style={{ background: BRAND.greenLight }}
          >
            <LuSnowflake className="text-2xl" style={{ color: BRAND.green }} />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Мастера по кондиционерам</h1>
            <div className="text-sm text-gray-500">Монтаж, заправка, диагностика — быстро и надёжно</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по имени"
              className="pl-9 pr-3 h-10 rounded-full border border-gray-300 bg-white text-sm"
            />
          </div>
          <button
            className="h-10 px-4 rounded-full border text-sm text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2"
            type="button"
          >
            <LuFilter />
            Фильтр
          </button>
        </div>
      </div>

      {/* Фильтр по подкатегориям */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSub('all')}
          className={[
            'px-3 py-1.5 rounded-full text-sm border transition',
            activeSub === 'all'
              ? 'bg-[color:var(--brand-green)] text-white border-transparent'
              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50',
          ].join(' ')}
          style={{ ['--brand-green']: BRAND.green }}
        >
          Все
        </button>
        {Object.entries(AC_SUBS).map(([id, name]) => {
          const active = String(activeSub) === String(id);
          return (
            <button
              key={id}
              onClick={() => setActiveSub(id)}
              className={[
                'px-3 py-1.5 rounded-full text-sm border transition',
                active
                  ? 'bg-slate-900 text-white border-transparent'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50',
              ].join(' ')}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* Сетка карточек */}
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

        {!isLoading && filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-16">
            <Image src="/empty.svg" alt="" width={120} height={120} className="opacity-80" />
            <div className="mt-3 text-gray-900 font-semibold">Ничего не найдено</div>
            <div className="text-sm text-gray-500">Попробуйте изменить фильтры или сбросить поиск</div>
          </div>
        )}

        {!isLoading && filtered.map((m) => <MasterCard key={m.id} m={m} />)}
      </div>
    </section>
  );
}
