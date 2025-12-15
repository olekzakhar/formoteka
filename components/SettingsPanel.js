// components/SettingsPanel.tsx
'use client'

import { X } from 'lucide-react';
import { fieldTypes } from '@/constants'

export default function SettingsPanel({
  selectedField,
  fields,
  submitButton,
  onClose,
  onUpdateField,
  onUpdateSubmitButton
}) {
  if (selectedField === 'submit-button') {
    return (
      <div className="fixed right-0 top-0 h-full w-80 bg-white border-l shadow-xl p-6 overflow-y-auto z-50 animate-slideIn">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Button Settings</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Button Text</label>
            <input
              type="text"
              value={submitButton.text}
              onChange={(e) => onUpdateSubmitButton({ ...submitButton, text: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="pt-4 border-t">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={submitButton.fullWidth}
                onChange={(e) => onUpdateSubmitButton({ ...submitButton, fullWidth: e.target.checked })}
              />
              <span className="text-sm font-medium">Full width button</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  const field = fields.find(f => f.id === selectedField);
  if (!field) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l shadow-xl p-6 overflow-y-auto z-50 animate-slideIn">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Field Settings</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Field Type</label>
          <select
            value={field.type}
            onChange={(e) => onUpdateField(field.id, 'type', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            {fieldTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Label</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdateField(field.id, 'label', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        {field.type !== 'checkbox' && (
          <div>
            <label className="block text-sm font-medium mb-2">Placeholder</label>
            <input
              type="text"
              value={field.placeholder}
              onChange={(e) => onUpdateField(field.id, 'placeholder', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        )}
        {(['select', 'radio', 'checkbox'].includes(field.type)) && (
          <div>
            <label className="block text-sm font-medium mb-2">Options (one per line)</label>
            <textarea
              value={field.options.join('\n')}
              onChange={(e) => onUpdateField(field.id, 'options', e.target.value.split('\n'))}
              className="w-full px-3 py-2 border rounded-md font-mono text-sm"
              rows={6}
            />
          </div>
        )}
        <div className="pt-4 border-t">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => onUpdateField(field.id, 'required', e.target.checked)}
            />
            <span className="text-sm font-medium">Required field</span>
          </label>
        </div>
      </div>
    </div>
  )
}
