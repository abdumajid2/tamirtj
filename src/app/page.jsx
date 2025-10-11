"use client";

import HeroMain from "@/components/hero/heroMain";
import Result from "@/components/sections/result";
import ServicesSection from "@/components/sections/services";
import Category from "@/components/category/category";
import HowItWorks from "@/components/hero/howitworks";
import ReviewsCarousel from "@/components/sections/ReviewsCarousel";
import FaqList from "@/components/sections/FaqList";

export default function Home() {


  return (
    <div className="space-y-12">
      <section>
        <HeroMain />
        <Result />
        <ServicesSection />
        <Category />
        <HowItWorks />
        <ReviewsCarousel/>
        <FaqList/>
      </section>

      
    </div>
  );
}
