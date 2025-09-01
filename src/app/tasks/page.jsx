'use client';
import TaskCard from "@/components/ui/TaskCard";
import { useGetTasksQuery } from "@/store/api/baseApi";
import { Select } from "antd";
export default function TasksPage() {
  const { data: tasks = [] } = useGetTasksQuery();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Заявки</h1>
        <Select placeholder="Статус" allowClear options={[
          {value: 'open', label: 'Открыта'},
          {value: 'in_progress', label: 'В работе'},
          {value: 'done', label: 'Завершена'}
        ]} />
      </div>
      <div className="grid-cards">{tasks.map(t => <TaskCard key={t.id} item={t} />)}</div>
    </div>
  );
}
