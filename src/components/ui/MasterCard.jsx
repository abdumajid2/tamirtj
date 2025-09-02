'use client';
import { Card, Rate, Tag, Button } from "antd";
import Image from "next/image";
import { HiOutlineBadgeCheck } from "react-icons/hi";
export default function MasterCard({ item }) {
  return (
    <Card className="card overflow-hidden">
      <div className="flex gap-4">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
          <Image src={item.avatar || "/placeholder-master.png"} alt={item.fullName} fill sizes="96px" style={{objectFit:"cover"}} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{item.fullName}</h3>
            {item.verified && <HiOutlineBadgeCheck className="text-sky-500" title="Проверенный мастер" />}
          </div>
          <div className="text-gray-600 text-sm">{item.city} • {item.experience} лет опыта</div>
          <div className="flex items-center gap-2 my-1">
            <Rate disabled allowHalf defaultValue={item.rating || 4.5} />
            <div className="text-sm text-gray-500">({item.reviews || 12})</div>
          </div>
          <div className="flex flex-wrap gap-2 my-2">
            {item.skills?.slice(0,4).map(s => <Tag key={s}>{s}</Tag>)}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-gray-700">от <span className="font-semibold">{item.pricePerHour}</span> TJS/час</div>
            <Button type="primary">Написать</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
