// components/orders/OrderModal

import { X } from 'lucide-react'

// Modal для перегляду заявки
export default function OrderModal({ selectedOrder, setSelectedOrder }) {
  return (
    <div 
      className="px-2 pt-[5.2%] sm:pt-[2.5%] pb-5 fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center z-50"
      onClick={() => setSelectedOrder(null)}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 pl-6 pr-4 py-4 flex justify-between">
          <div>
            <h2 className="text-xl font-bold">Деталі заявки</h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedOrder.submittedAt}
            </p>
          </div>
          <button
            onClick={() => setSelectedOrder(null)}
            className="-mt-0.5 p-2 h-8 bg-gray-200/50 hover:bg-gray-200/70 text-gray-500 hover:text-gray-600 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {Object.entries(selectedOrder.fields).map(([field, value], index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="text-sm font-medium text-gray-500 mb-1">
                {field}
              </div>
              <div className="text-base text-gray-900">
                {value || '-'}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={() => setSelectedOrder(null)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Закрити
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
            Видалити заявку
          </button>
        </div>
      </div>
    </div>
  )
}
