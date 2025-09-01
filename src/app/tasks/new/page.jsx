'use client';
import { Form, Input, Select, InputNumber, Upload, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAddTaskMutation } from "@/store/api/baseApi";
export default function NewTaskPage() {
  const [form] = Form.useForm();
  const [addTask, { isLoading }] = useAddTaskMutation();
  const onFinish = async (values) => {
    try {
      await addTask({ ...values, createdAt: new Date().toISOString(), status: "open", images: [] }).unwrap();
      message.success("Заявка создана!"); form.resetFields();
    } catch { message.error("Ошибка при создании."); }
  };
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Новая заявка</h1>
      <div className="card p-6">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Название" name="title" rules={[{ required: true }]}><Input placeholder="Например: Ремонт ванной 6 м²" /></Form.Item>
          <Form.Item label="Описание" name="description" rules={[{ required: true }]}><Input.TextArea rows={4} placeholder="Опишите задачу, материалы, сроки" /></Form.Item>
          <div className="grid md:grid-cols-2 gap-4">
            <Form.Item label="Город" name="city" rules={[{ required: true }]}>
              <Select placeholder="Выберите город" options={[
                {value: 'Dushanbe', label: 'Душанбе'},
                {value: 'Khujand', label: 'Худжанд'},
                {value: 'Bokhtar', label: 'Бохтар'},
              ]} />
            </Form.Item>
            <Form.Item label="Бюджет (TJS)" name="budget" rules={[{ required: true }]}><InputNumber className="w-full" min={100} step={50} /></Form.Item>
          </div>
          <Form.Item label="Контактное имя" name="clientName" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Изображения (опционально)">
            <Upload listType="picture-card" beforeUpload={() => false}><button type="button"><PlusOutlined /> Добавить</button></Upload>
          </Form.Item>
          <Form.Item><Button type="primary" htmlType="submit" loading={isLoading}>Создать</Button></Form.Item>
        </Form>
      </div>
    </div>
  );
}
