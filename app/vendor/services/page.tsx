'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  isActive: boolean;
}

const mockServices: Service[] = [
  {
    id: '1',
    name: '外壁塗装',
    description: '高品質な塗料を使用した外壁塗装サービス',
    price: 500000,
    unit: '一式',
    category: '塗装工事',
    isActive: true,
  },
  {
    id: '2',
    name: '屋根修理',
    description: '瓦やスレートの修理・交換',
    price: 300000,
    unit: '一式',
    category: '屋根工事',
    isActive: true,
  },
  {
    id: '3',
    name: '内装リフォーム',
    description: 'クロス張替え、床材交換など',
    price: 200000,
    unit: '一式',
    category: 'リフォーム',
    isActive: false,
  },
];

export default function VendorServices() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('このサービスを削除してもよろしいですか?')) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setServices(
      services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">サービス管理</h1>
          <p className="mt-2 text-gray-600">提供するサービスと料金を管理できます</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              サービス追加
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>新規サービス追加</DialogTitle>
            </DialogHeader>
            <ServiceForm onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <Card key={service.id}>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <button className="mt-1 cursor-grab text-gray-400 hover:text-gray-600">
                    <GripVertical className="h-5 w-5" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                      <Badge variant={service.isActive ? 'default' : 'secondary'}>
                        {service.isActive ? '公開中' : '非公開'}
                      </Badge>
                      <Badge variant="outline">{service.category}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{service.description}</p>
                    <div className="mt-3 flex items-center space-x-4 text-sm">
                      <span className="font-semibold text-orange-600">
                        ¥{service.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500">/ {service.unit}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(service.id)}
                  >
                    {service.isActive ? '非公開にする' : '公開する'}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>サービス編集</DialogTitle>
                      </DialogHeader>
                      <ServiceForm service={service} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <p className="text-gray-500">まだサービスが登録されていません</p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              最初のサービスを追加
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function ServiceForm({ service, onClose }: { service?: Service; onClose?: () => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save logic
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          サービス名 <span className="text-red-500">*</span>
        </label>
        <Input placeholder="例: 外壁塗装" defaultValue={service?.name} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          カテゴリ <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          defaultValue={service?.category}
          required
        >
          <option value="">選択してください</option>
          <option value="塗装工事">塗装工事</option>
          <option value="屋根工事">屋根工事</option>
          <option value="リフォーム">リフォーム</option>
          <option value="新築">新築</option>
          <option value="その他">その他</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          説明 <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[100px]"
          placeholder="サービスの詳細を記載してください..."
          defaultValue={service?.description}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            料金 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">¥</span>
            <Input
              type="number"
              className="pl-8"
              placeholder="0"
              defaultValue={service?.price}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            単位 <span className="text-red-500">*</span>
          </label>
          <Input placeholder="例: 一式、1㎡" defaultValue={service?.unit} required />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose}>
          キャンセル
        </Button>
        <Button type="submit">{service ? '更新' : '追加'}</Button>
      </div>
    </form>
  );
}
