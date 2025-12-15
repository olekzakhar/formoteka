// components/AddFieldPanel.tsx
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { fieldTypes } from '@/constants';

export default function AddFieldPanel({ selectedField, onClose, onAddField }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewFieldType, setPreviewFieldType] = useState('text');

  const filteredFieldTypes = fieldTypes.filter(type =>
    type.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedType = fieldTypes.find(t => t.value === previewFieldType);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find questions, input fields and layout options..."
              className="w-full pl-12 pr-4 py-3 border rounded-lg"
              autoFocus
            />
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 border-r overflow-y-auto p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Questions</h3>
            {filteredFieldTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setPreviewFieldType(type.value)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all mb-1 ${
                  previewFieldType === type.value
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <span className="text-xl">{type.icon}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto">
            {selectedType ? (
              <>
                <h2 className="text-2xl font-bold mb-3">{selectedType.label}</h2>
                <p className="text-gray-600 mb-6">{selectedType.description}</p>
                <button
                  onClick={() => onAddField(selectedType.value, selectedField)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all"
                >
                  Insert <span>→</span>
                </button>
                
                <div className="mt-8 pt-8 border-t">
                  <p className="text-sm text-gray-500 mb-4">Example</p>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-lg font-medium mb-3">What is your first name?</p>
                    {selectedType.value === 'text' && (
                      <input type="text" disabled className="w-full px-3 py-2 border rounded-md" />
                    )}
                    {selectedType.value === 'textarea' && (
                      <textarea disabled rows={4} className="w-full px-3 py-2 border rounded-md" />
                    )}
                    {selectedType.value === 'email' && (
                      <input type="email" disabled className="w-full px-3 py-2 border rounded-md" />
                    )}
                    {selectedType.value === 'number' && (
                      <input type="number" disabled className="w-full px-3 py-2 border rounded-md" />
                    )}
                    {selectedType.value === 'date' && (
                      <input type="date" disabled className="w-full px-3 py-2 border rounded-md" />
                    )}
                    {selectedType.value === 'select' && (
                      <select disabled className="w-full px-3 py-2 border rounded-md">
                        <option>Select an option</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                      </select>
                    )}
                    {selectedType.value === 'radio' && (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="radio" disabled />
                          <span className="text-sm">Option 1</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" disabled />
                          <span className="text-sm">Option 2</span>
                        </label>
                      </div>
                    )}
                    {selectedType.value === 'checkbox' && (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" disabled />
                          <span className="text-sm">Option 1</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" disabled />
                          <span className="text-sm">Option 2</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center py-12 text-gray-400">No fields found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
