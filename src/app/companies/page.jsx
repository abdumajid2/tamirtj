'use client';
import CompanyCard from "@/components/ui/CompanyCard";
import { useGetCompaniesQuery } from "@/store/api/baseApi";
export default function CompaniesPage() {
  const { data: companies = [] } = useGetCompaniesQuery();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Строительные компании и магазины</h1>
      <div className="grid-cards">{companies.map(c => <CompanyCard key={c.id} item={c} />)}</div>
    </div>
  );
}
