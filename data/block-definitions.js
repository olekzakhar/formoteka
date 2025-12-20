export const blockDefinitions = [
  { type: 'products', label: 'Products', icon: 'Package', category: 'choice' },
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
  { type: 'spacer', label: 'Spacer', icon: 'Minus', category: 'layout' },
  { type: 'image', label: 'Image', icon: 'Image', category: 'content' },
  { type: 'divider', label: 'Divider', icon: 'SeparatorHorizontal', category: 'layout' },
];

export const getDefaultBlock = (type) => {
  const defaults = {
    heading: { label: 'New Heading', showLabel: true },
    paragraph: { label: 'Enter your paragraph text here...', showLabel: true },
    'short-text': { label: 'Short Text', placeholder: 'Enter text...', showLabel: true },
    'long-text': { label: 'Long Text', placeholder: 'Enter your answer...', showLabel: true },
    email: { label: 'Email', placeholder: 'your@email.com', showLabel: true },
    number: { label: 'Number', placeholder: '0', showLabel: true },
    dropdown: { label: 'Dropdown', options: ['Option 1', 'Option 2', 'Option 3'], showLabel: true },
    checkbox: { label: 'Checkbox', options: ['Option 1', 'Option 2'], showLabel: true },
    radio: { label: 'Radio Group', options: ['Option 1', 'Option 2', 'Option 3'], showLabel: true },
    date: { label: 'Date', placeholder: 'Select a date', showLabel: true },
    products: { label: 'Products', products: [], productsLayout: 'grid-2', showLabel: true },
    spacer: { label: 'Spacer', height: 32 },
    image: { label: 'Image', imageCount: 1, images: [] },
    divider: { label: 'Divider', dividerColor: '#e5e7eb', dividerThickness: 1, dividerWidth: 100, dividerStyle: 'solid' },
  };
  return defaults[type] || { label: 'New Block' };
};
