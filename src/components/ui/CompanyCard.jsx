'use client';
import { Card, Rate, Tag, Button } from "antd";
import Image from "next/image";
export default function CompanyCard({ item }) {
  return (
    <Card className="card overflow-hidden">
      <div className="flex gap-4">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
          <Image src={item.logo || "/placeholder-company.png"} alt={item.name} fill sizes="96px" style={{objectFit:"cover"}} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <div className="text-gray-600 text-sm">{item.city}</div>
          <div className="flex items-center gap-2 my-1">
            <Rate disabled allowHalf defaultValue={item.rating || 4.3} />
            <div className="text-sm text-gray-500">({item.reviews || 8})</div>
          </div>
          <div className="flex flex-wrap gap-2 my-2">{item.services?.slice(0,4).map(s => <Tag key={s}>{s}</Tag>)}</div>
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-gray-700">Средний чек: <span className="font-semibold">{item.avgCheck}</span> TJS</div>
            <Button type="primary">Связаться</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
