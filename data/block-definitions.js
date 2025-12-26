export const blockDefinitions = [
  { type: 'products', label: 'Продукти', icon: 'Package', category: 'choice' },
  { type: 'heading', label: 'Заголовок', icon: 'Heading', category: 'content' },
  { type: 'paragraph', label: 'Текст', icon: 'AlignLeft', category: 'content' },
  { type: 'short-text', label: 'Текст', icon: 'Type', category: 'input' },
  { type: 'long-text', label: 'Довгий текст', icon: 'FileText', category: 'input' },
  { type: 'email', label: 'Електронна пошта', icon: 'Mail', category: 'input' },
  { type: 'number', label: 'Число', icon: 'Hash', category: 'input' },
  { type: 'dropdown', label: 'Випадаючий список', icon: 'ChevronDown', category: 'choice' },
  { type: 'checkbox', label: 'Прапорець', icon: 'CheckSquare', category: 'choice' },
  { type: 'radio', label: 'Перемикач', icon: 'Circle', category: 'choice' },
  { type: 'date', label: 'Дата', icon: 'Calendar', category: 'input' },
  { type: 'spacer', label: 'Простір', icon: 'Minus', category: 'layout' },
  { type: 'image', label: 'Зображення', icon: 'Image', category: 'content' },
  { type: 'divider', label: 'Розділювач', icon: 'SeparatorHorizontal', category: 'layout' },
];

export const getDefaultBlock = (type) => {
  const defaults = {
    heading: { label: 'Новий заголовок', showLabel: true },
    paragraph: { label: 'Введіть текст тут...', showLabel: true },
    'short-text': { label: 'Текст', placeholder: 'Введіть текст...', showLabel: true },
    'long-text': { label: 'Довгий текст', placeholder: 'Введіть відповідь...', showLabel: true },
    email: { label: 'Електронна пошта', placeholder: 'твій@email.com', showLabel: true },
    number: { label: 'Число', placeholder: '0', showLabel: true },
    dropdown: { label: 'Випадаючий список', options: ['Варіант 1', 'Варіант 2', 'Варіант 3'], showLabel: true },
    checkbox: { label: 'Прапорець', options: ['Варіант 1', 'Варіант 2'], showLabel: true },
    radio: { label: 'Група перемикачів', options: ['Варіант 1', 'Варіант 2', 'Варіант 3'], showLabel: true },
    date: { label: 'Дата', placeholder: 'Оберіть дату', showLabel: true },
    products: { label: 'Продукти', products: [], productsLayout: 'grid-2', showLabel: true },
    spacer: { label: 'Простір', height: 32 },
    image: { label: 'Зображення', imageCount: 1, images: [] },
    divider: { label: 'Розділювач', dividerColor: '#e5e7eb', dividerThickness: 1, dividerWidth: 100, dividerStyle: 'solid' },
  };
  return defaults[type] || { label: 'New Block' };
};
