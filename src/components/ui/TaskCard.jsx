'use client';
import { Card, Tag, Button } from "antd";
import dayjs from "dayjs";
export default function TaskCard({ item }) {
  return (
    <Card className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <div className="text-gray-600 text-sm">{item.city} • бюджет {item.budget} TJS</div>
          <div className="text-gray-500 text-xs mt-1">{dayjs(item.createdAt).format("DD.MM.YYYY HH:mm")}</div>
          <div className="flex gap-2 mt-2">{item.tags?.map(t => <Tag key={t}>{t}</Tag>)}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Tag color={item.status === 'open' ? 'green' : item.status === 'in_progress' ? 'blue' : 'default'}>
            {item.status === 'open' ? 'Открыта' : item.status === 'in_progress' ? 'В работе' : 'Завершена'}
          </Tag>
          <Button className="btn">Откликнуться</Button>
        </div>
      </div>
    </Card>
  );
}
