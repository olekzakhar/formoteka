export const blockDefinitions = [
  { type: 'heading', label: 'Heading', icon: 'Heading', category: 'content' },
  { type: 'paragraph', label: 'Paragraph', icon: 'AlignLeft', category: 'content' },
  { type: 'short-text', label: 'Short Text', icon: 'Type', category: 'input' },
  { type: 'long-text', label: 'Long Text', icon: 'FileText', category: 'input' },
  { type: 'email', label: 'Email', icon: 'Mail', category: 'input' },
  { type: 'number', label: 'Number', icon: 'Hash', category: 'input' },
  { type: 'dropdown', label: 'Dropdown', icon: 'ChevronDown', category: 'choice' },
  { type: 'checkbox', label: 'Checkbox', icon: 'CheckSquare', category: 'choice' },
  { type: 'radio', label: 'Radio', icon: 'Circle', category: 'choice' },
  { type: 'date', label: 'Date', icon: 'Calendar', category: 'input' },
];

export const getDefaultBlock = (type) => {
  const defaults = {
    heading: { label: 'New Heading' },
    paragraph: { label: 'Enter your paragraph text here...' },
    'short-text': { label: 'Short Text', placeholder: 'Enter text...' },
    'long-text': { label: 'Long Text', placeholder: 'Enter your answer...' },
    email: { label: 'Email', placeholder: 'your@email.com' },
    number: { label: 'Number', placeholder: '0' },
    dropdown: { label: 'Dropdown', options: ['Option 1', 'Option 2', 'Option 3'] },
    checkbox: { label: 'Checkbox', options: ['Option 1', 'Option 2'] },
    radio: { label: 'Radio Group', options: ['Option 1', 'Option 2', 'Option 3'] },
    date: { label: 'Date', placeholder: 'Select a date' },
  };
  return defaults[type] || { label: 'New Block' };
};
