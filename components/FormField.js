
// components/FormField.tsx
'use client'

import { Plus, Trash2, Settings, Copy, GripVertical } from 'lucide-react'

export default function FormField({
  field,
  isPreview,
  isSelected,
  isHovered,
  isDragging,
  formResponses,
  onSelect,
  onHover,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDelete,
  onDuplicate,
  onShowAddPanel,
  setFormResponses
}) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isPreview) onDragOver(field.id);
      }}
      onMouseEnter={() => !isPreview && onHover(field.id)}
      onMouseLeave={() => !isPreview && onHover(null)}
      onClick={() => !isPreview && onSelect(field.id)}
      className={`relative bg-white rounded-lg p-4 mb-3 transition-all duration-200 ${
        isSelected ? 'border-2 border-blue-500 shadow-md' : 'border-2 border-transparent'
      } ${isDragging ? 'opacity-50' : ''} ${!isPreview ? 'cursor-pointer' : ''}`}
    >
      {!isPreview && isHovered && (
        <>
          <div
            className="absolute -left-12 top-4"
            onMouseEnter={() => onHover(field.id)}
            onMouseLeave={() => onHover(null)}
          >
            <div className="flex flex-col gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowAddPanel();
                  onSelect(field.id);
                }}
                className="p-1.5 hover:bg-blue-50 rounded transition-colors w-8 h-8 flex items-center justify-center"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(field.id);
                }}
                className="p-1.5 hover:bg-blue-50 rounded transition-colors w-8 h-8 flex items-center justify-center"
              >
                <Copy size={16} className="text-gray-600" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(field.id);
                }}
                className="p-1.5 hover:bg-blue-50 rounded transition-colors w-8 h-8 flex items-center justify-center"
              >
                <Settings size={16} className="text-gray-600" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(field.id);
                }}
                className="p-1.5 hover:bg-red-50 rounded transition-colors w-8 h-8 flex items-center justify-center"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          </div>
          <div
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              onDragStart(field.id);
            }}
            onDragEnd={(e) => {
              e.stopPropagation();
              onDragEnd();
            }}
            className="absolute -right-12 top-1/2 -translate-y-1/2 py-4 px-3 cursor-move"
            style={{ width: '56px' }}
            onMouseEnter={() => onHover(field.id)}
            onMouseLeave={() => onHover(null)}
          >
            <div className="bg-white border border-gray-200 rounded p-2 shadow-lg">
              <GripVertical size={18} className="text-gray-400" />
            </div>
          </div>
        </>
      )}
      
      <div className={`mb-2 ${!isPreview ? 'pointer-events-none' : ''}`}>
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      {field.type === 'text' && (
        <input
          type="text"
          placeholder={field.placeholder}
          disabled={!isPreview}
          value={isPreview ? (formResponses[field.id] || '') : ''}
          onChange={isPreview ? (e) => setFormResponses({ ...formResponses, [field.id]: e.target.value }) : undefined}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${!isPreview ? 'pointer-events-none' : ''}`}
        />
      )}
      
      {field.type === 'email' && (
        <input
          type="email"
          placeholder={field.placeholder}
          disabled={!isPreview}
          value={isPreview ? (formResponses[field.id] || '') : ''}
          onChange={isPreview ? (e) => setFormResponses({ ...formResponses, [field.id]: e.target.value }) : undefined}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${!isPreview ? 'pointer-events-none' : ''}`}
        />
      )}
      
      {field.type === 'number' && (
        <input
          type="number"
          placeholder={field.placeholder}
          disabled={!isPreview}
          value={isPreview ? (formResponses[field.id] || '') : ''}
          onChange={isPreview ? (e) => setFormResponses({ ...formResponses, [field.id]: e.target.value }) : undefined}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${!isPreview ? 'pointer-events-none' : ''}`}
        />
      )}
      
      {field.type === 'date' && (
        <input
          type="date"
          disabled={!isPreview}
          value={isPreview ? (formResponses[field.id] || '') : ''}
          onChange={isPreview ? (e) => setFormResponses({ ...formResponses, [field.id]: e.target.value }) : undefined}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${!isPreview ? 'pointer-events-none' : ''}`}
        />
      )}
      
      {field.type === 'textarea' && (
        <textarea
          placeholder={field.placeholder}
          rows={4}
          disabled={!isPreview}
          value={isPreview ? (formResponses[field.id] || '') : ''}
          onChange={isPreview ? (e) => setFormResponses({ ...formResponses, [field.id]: e.target.value }) : undefined}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${!isPreview ? 'pointer-events-none' : ''}`}
        />
      )}
      
      {field.type === 'select' && (
        <select
          disabled={!isPreview}
          value={isPreview ? (formResponses[field.id] || '') : ''}
          onChange={isPreview ? (e) => setFormResponses({ ...formResponses, [field.id]: e.target.value }) : undefined}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${!isPreview ? 'pointer-events-none' : ''}`}
        >
          <option value="">Select an option</option>
          {field.options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      )}
      
      {field.type === 'radio' && (
        <div className={`space-y-2 ${!isPreview ? 'pointer-events-none' : ''}`}>
          {field.options.map((opt, i) => (
            <label key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name={`field-${field.id}`}
                value={opt}
                disabled={!isPreview}
                checked={isPreview && formResponses[field.id] === opt}
                onChange={isPreview ? (e) => setFormResponses({ ...formResponses, [field.id]: e.target.value }) : undefined}
              />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      )}
      
      {field.type === 'checkbox' && (
        <div className={`space-y-2 ${!isPreview ? 'pointer-events-none' : ''}`}>
          {field.options.map((opt, i) => {
            const checkboxValues = isPreview ? (formResponses[field.id] || []) : [];
            return (
              <label key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  disabled={!isPreview}
                  checked={checkboxValues.includes(opt)}
                  onChange={isPreview ? (e) => {
                    const current = formResponses[field.id] || [];
                    const updated = e.target.checked 
                      ? [...current, opt] 
                      : current.filter((v) => v !== opt);
                    setFormResponses({ ...formResponses, [field.id]: updated });
                  } : undefined}
                />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  )
}
