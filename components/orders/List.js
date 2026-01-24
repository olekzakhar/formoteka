// components/orders/List

'use client'

import { useState } from 'react';
import { Maximize2, Trash2, X, Calendar } from 'lucide-react';
import OrderModal from '@/components/orders/OrderModal';

// Тестові дані
const mockOrders = [
  {
    id: 1,
    submittedAt: 'Jan 23, 02:19 PM',
    fields: {
      'Ім\'я': 'Олександр Коваленко',
      'Email': 'oleksandr.kovalenko@gmail.com',
      'Телефон': '+380 67 123 4567',
      'Компанія': 'Tech Solutions Ltd',
      'Посада': 'Головний інженер',
      'Тип звернення': 'Консультація',
      'Бюджет': '50,000 - 100,000 грн',
      'Термін реалізації': '2-3 місяці',
      'Опис проекту': 'Потрібна розробка веб-платформи для управління проектами з інтеграцією CRM системи',
      'Джерело': 'Google Ads',
      'Місто': 'Київ'
    }
  },
  {
    id: 2,
    submittedAt: 'Jan 23, 01:57 PM',
    fields: {
      'Ім\'я': 'Марія Шевченко',
      'Email': 'maria.shevchenko@example.com',
      'Телефон': '+380 50 987 6543',
      'Компанія': 'Creative Agency',
      'Посада': 'Арт-директор',
      'Тип звернення': 'Розробка сайту',
      'Бюджет': '30,000 - 50,000 грн',
      'Термін реалізації': '1 місяць',
      'Опис проекту': 'Необхідний лендінг для запуску нового продукту з адаптивним дизайном',
      'Джерело': 'Рекомендація',
      'Місто': 'Львів'
    }
  },
  {
    id: 3,
    submittedAt: 'Jan 23, 01:48 PM',
    fields: {
      'Ім\'я': 'Андрій Мельник',
      'Email': 'andrii.melnyk@business.ua',
      'Телефон': '+380 63 456 7890',
      'Компанія': 'E-Commerce Store',
      'Посада': 'Власник',
      'Тип звернення': 'Техпідтримка',
      'Бюджет': '10,000 - 30,000 грн',
      'Термін реалізації': 'Терміново',
      'Опис проекту': 'Потрібна термінова технічна підтримка інтернет-магазину, виникли проблеми з оплатою',
      'Джерело': 'Facebook',
      'Місто': 'Одеса'
    }
  },
  {
    id: 4,
    submittedAt: 'Jan 23, 12:30 PM',
    fields: {
      'Ім\'я': 'Ірина Бондаренко',
      'Email': 'iryna.bondarenko@startup.io',
      'Телефон': '+380 95 111 2233',
      'Компанія': 'StartUp Innovations',
      'Посада': 'CEO',
      'Тип звернення': 'Консультація',
      'Бюджет': '100,000+ грн',
      'Термін реалізації': '6+ місяців',
      'Опис проекту': 'Розробка MVP для мобільного додатку з backend інфраструктурою та адмін-панеллю',
      'Джерело': 'LinkedIn',
      'Місто': 'Дніпро'
    }
  },
  {
    id: 5,
    submittedAt: 'Jan 23, 11:15 AM',
    fields: {
      'Ім\'я': 'Петро Васильєв',
      'Email': 'petro.v@consulting.com',
      'Телефон': '+380 44 999 8877',
      'Компанія': 'Business Consulting Group',
      'Посада': 'Менеджер проектів',
      'Тип звернення': 'Аудит сайту',
      'Бюджет': '5,000 - 10,000 грн',
      'Термін реалізації': '2 тижні',
      'Опис проекту': 'Необхідний технічний аудит корпоративного сайту та рекомендації щодо оптимізації',
      'Джерело': 'Пошукова видача',
      'Місто': 'Харків'
    }
  }
];

export default function OrdersList({ slug }) {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  const orders = mockOrders;
  const totalCount = orders.length;
  
  // Отримуємо всі унікальні поля
  const allFields = orders.length > 0 
    ? Object.keys(orders[0].fields)
    : [];

  return (
    <div className="max-w-full mx-auto px-4">
      {/* Header */}
      <div className="mb-6 pl-1">
        <h1 className="text-3xl font-bold mb-2">Заявки</h1>
        <div className="text-sm text-gray-600 mb-6">
          Форма: {slug}
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-black! text-black'
                : 'border-transparent! text-gray-500 hover:text-gray-700'
            }`}
          >
            All <span className="ml-1 text-gray-500">{totalCount}</span>
          </button>
          {/* <button
            onClick={() => setActiveTab('completed')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'completed'
                ? 'border-black! text-black'
                : 'border-transparent! text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed <span className="ml-1 text-gray-500">3</span>
          </button> */}
          {/* <button
            onClick={() => setActiveTab('partial')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'partial'
                ? 'border-black! text-black'
                : 'border-transparent! text-gray-500 hover:text-gray-700'
            }`}
          >
            Partial <span className="ml-1 text-gray-500">0</span>
          </button> */}
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-normal text-gray-600 border-r border-gray-200 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Submitted at</span>
                  </div>
                </th>
                {allFields.map((field, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-sm font-normal text-gray-600 border-r border-gray-200 last:border-r-0 whitespace-nowrap"
                  >
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-gray-50 group"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap border-r border-gray-200">
                    <div className="flex items-center gap-2">
                      <span>{order.submittedAt}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Переглянути заявку"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <button
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Видалити"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-gray-600 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  </td>
                  {allFields.map((field, index) => (
                    <td 
                      key={index} 
                      className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap border-r border-gray-200 last:border-r-0"
                    >
                      {order.fields[field] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal для перегляду заявки */}
      {selectedOrder && (
        <OrderModal
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder} />
      )}
    </div>
  )
}
