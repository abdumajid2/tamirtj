"use client";


import { useGetMastersQuery, useGetOrdersQuery } from "@/store/api/baseApi";


import HeroMain from "@/components/hero/heroMain";
import Result from "@/components/sections/result";
import ServicesSection from "@/components/sections/services";
import Category from "@/components/category/category";
import HowItWorks from "@/components/hero/howitworks";
import ReviewsAndFaq from "@/components/hero/reviews";

export default function Home() {
  const { data: masters = [] } = useGetMastersQuery();
  // заменено: useGetTasksQuery -> useGetOrdersQuery
  const { data: tasks = [] } = useGetOrdersQuery();

  return (
    <div className="space-y-12">
      <section>
        <HeroMain />
        <Result />
        <ServicesSection />
        <Category />
        <HowItWorks />
        <ReviewsAndFaq/>
      </section>

      
    </div>
  );
}
