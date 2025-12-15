// components/FormBuilder.tsx
'use client'

import { useState } from 'react';
import { Plus, Eye, Code, X } from 'lucide-react';
import FormField from './FormField';
import SettingsPanel from './SettingsPanel';
import AddFieldPanel from './AddFieldPopup';

export default function FormBuilder() {
  const [fields, setFields] = useState([]);
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [formResponses, setFormResponses] = useState({});
  const [hoveredField, setHoveredField] = useState(null);
  const [draggedField, setDraggedField] = useState(null);
  const [submitButton, setSubmitButton] = useState({ 
    text: 'Submit', 
    fullWidth: true 
  });

  const addField = (type, afterFieldId) => {
    const newField = {
      id: Date.now(),
      type,
      label: `New ${type} field`,
      placeholder: '',
      required: false,
      options: ['select', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : []
    };
    
    if (afterFieldId) {
      const idx = fields.findIndex(f => f.id === afterFieldId);
      const newFields = [...fields];
      newFields.splice(idx + 1, 0, newField);
      setFields(newFields);
    } else {
      setFields([...fields, newField]);
    }
    
    setShowAddPanel(false);
    setSelectedField(newField.id);
  };

  const duplicateField = (fieldId) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;
    const newField = { ...field, id: Date.now(), label: field.label + ' (copy)' };
    const idx = fields.findIndex(f => f.id === fieldId);
    const newFields = [...fields];
    newFields.splice(idx + 1, 0, newField);
    setFields(newFields);
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const deleteField = (id) => {
    setFields(fields.filter(f => f.id !== id));
    if (selectedField === id) setSelectedField(null);
  };

  const handleDragStart = (fieldId) => {
    setDraggedField(fieldId);
  };

  const handleDragOver = (fieldId) => {
    if (!draggedField || draggedField === fieldId) return;
    const draggedIdx = fields.findIndex(f => f.id === draggedField);
    const targetIdx = fields.findIndex(f => f.id === fieldId);
    if (draggedIdx === -1 || targetIdx === -1) return;
    const newFields = [...fields];
    const [removed] = newFields.splice(draggedIdx, 1);
    newFields.splice(targetIdx, 0, removed);
    setFields(newFields);
  };

  const handleDragEnd = () => {
    setDraggedField(null);
  };

  const handleSubmit = () => {
    const missingRequired = fields.filter(f => f.required && !formResponses[f.id]);
    if (missingRequired.length > 0) {
      alert(`Please fill in all required fields: ${missingRequired.map(f => f.label).join(', ')}`);
      return;
    }
    alert('Form submitted successfully!');
  };

  return (
    <>
      <style>{`
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes scaleIn{from{transform:scale(0.95);opacity:0}to{transform:scale(1);opacity:1}}
        .animate-slideIn{animation:slideIn .2s ease-out}
        .animate-fadeIn{animation:fadeIn .15s ease-out}
        .animate-scaleIn{animation:scaleIn .2s ease-out}
      `}</style>
      
      <div className={`transition-all duration-300 ${selectedField && !showPreview && !showAddPanel ? 'pr-80' : ''}`}>
        <div className="max-w-3xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-8" onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedField(null);
          }}>
            <div className="flex items-center justify-between mb-6" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-3xl font-bold text-gray-800 border-b-2 border-transparent hover:border-gray-300 focus:outline-none transition-colors"
              />
              <button
                onClick={() => {
                  setShowPreview(!showPreview);
                  setSelectedField(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                {showPreview ? (
                  <><Code size={18} />Edit</>
                ) : (
                  <><Eye size={18} />Preview</>
                )}
              </button>
            </div>

            <div className={!showPreview ? 'pl-14 pr-14' : ''}>
              {!showPreview ? (
                <>
                  {fields.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-lg mb-4 text-gray-400">No fields yet</p>
                      <button
                        onClick={() => setShowAddPanel(true)}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg flex items-center gap-2 mx-auto hover:bg-blue-600 transition-all"
                      >
                        <Plus size={18} />Add Your First Field
                      </button>
                    </div>
                  )}
                  
                  {fields.map(field => (
                    <FormField
                      key={field.id}
                      field={field}
                      isPreview={false}
                      isSelected={selectedField === field.id}
                      isHovered={hoveredField === field.id}
                      isDragging={draggedField === field.id}
                      formResponses={formResponses}
                      onSelect={setSelectedField}
                      onHover={setHoveredField}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDragEnd={handleDragEnd}
                      onDelete={deleteField}
                      onDuplicate={duplicateField}
                      onShowAddPanel={() => setShowAddPanel(true)}
                      setFormResponses={setFormResponses}
                    />
                  ))}
                  
                  {fields.length > 0 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedField('submit-button');
                        }}
                        className={`mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all ${
                          submitButton.fullWidth ? 'w-full' : ''
                        } ${selectedField === 'submit-button' ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                      >
                        {submitButton.text}
                      </button>
                      <button
                        onClick={() => setShowAddPanel(true)}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 mt-6 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Plus size={18} />Add Field
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {fields.length === 0 ? (
                    <p className="text-center py-12 text-gray-400">No fields to preview</p>
                  ) : (
                    <>
                      {fields.map(field => (
                        <FormField
                          key={field.id}
                          field={field}
                          isPreview={true}
                          isSelected={false}
                          isHovered={false}
                          isDragging={false}
                          formResponses={formResponses}
                          onSelect={setSelectedField}
                          onHover={setHoveredField}
                          onDragStart={handleDragStart}
                          onDragOver={handleDragOver}
                          onDragEnd={handleDragEnd}
                          onDelete={deleteField}
                          onDuplicate={duplicateField}
                          onShowAddPanel={() => setShowAddPanel(true)}
                          setFormResponses={setFormResponses}
                        />
                      ))}
                      <button
                        onClick={handleSubmit}
                        className={`mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all ${
                          submitButton.fullWidth ? 'w-full' : ''
                        }`}
                      >
                        {submitButton.text}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedField && !showPreview && !showAddPanel && (
        <SettingsPanel
          selectedField={selectedField}
          fields={fields}
          submitButton={submitButton}
          onClose={() => setSelectedField(null)}
          onUpdateField={updateField}
          onUpdateSubmitButton={setSubmitButton}
        />
      )}

      {showAddPanel && (
        <AddFieldPanel
          selectedField={typeof selectedField === 'number' ? selectedField : null}
          onClose={() => setShowAddPanel(false)}
          onAddField={addField}
        />
      )}
    </>
  );
}
