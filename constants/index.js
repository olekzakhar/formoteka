export const fieldTypes = [
  {
    value: 'text',
    label: 'Short answer',
    icon: '═',
    description: 'Use this to insert a question combined with a short text answer.'
  },
  {
    value: 'textarea',
    label: 'Long answer',
    icon: '≡',
    description: 'Use this to insert a question combined with a long text answer.'
  },
  {
    value: 'radio',
    label: 'Multiple choice',
    icon: '◉',
    description: 'Use this to insert a question with multiple choice options.'
  },
  {
    value: 'checkbox',
    label: 'Checkboxes',
    icon: '☑',
    description: 'Use this to insert a question with multiple checkboxes.'
  },
  {
    value: 'select',
    label: 'Dropdown',
    icon: '⌄',
    description: 'Use this to insert a question with a dropdown menu.'
  },
  {
    value: 'number',
    label: 'Number',
    icon: '#',
    description: 'Use this to insert a question combined with a number answer.'
  },
  {
    value: 'email',
    label: 'Email',
    icon: '@',
    description: 'Use this to insert a question combined with an email answer.'
  },
  {
    value: 'date',
    label: 'Date',
    icon: '📅',
    description: 'Use this to insert a question combined with a date picker.'
  }
]



export const BASE_URL = process.env.NEXT_PUBLIC_URL
export const STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL
export const FORMS_PATH = '/forms'
export const SIGN_IN_PATH = '/login'
export const SIGN_UP_PATH = '/register'

export const SEO_TITLE = "Форми замовлень без втрати клієнтів | Formoteka";
export const SEO_DESCRIPTION = "Сервіс для створення форм замовлень. Допомагає отримувати чіткі заявки і зменшувати втрати клієнтів.";

export const OG_TITLE = 'Форми замовлень без втрати клієнтів | Formoteka'
export const OG_DESCRIPTION = 'Formoteka допомагає перетворювати інтерес клієнтів на чіткі замовлення через форми.'
export const OG_IMAGE_URL = ''
