import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from 'nanoid'
// import slugify from 'slugify'
// import { STORAGE_URL } from '@/constants'

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function pluralize(count, one='заявка', few='заявки', many='заявок') {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod100 >= 11 && mod100 <= 14) return `${count} ${many}`
  if (mod10 === 1) return `${count} ${one}`
  if (mod10 >= 2 && mod10 <= 4) return `${count} ${few}`
  return `${count} ${many}`
}


export function timeAgo(date) {
  if (!date) return ''

  const parsed = typeof date === 'string'
    ? new Date(date)
    : date

  const timestamp = parsed.getTime()

  // ❌ невалідна дата
  if (isNaN(timestamp)) return ''

  const diffMs = Date.now() - timestamp

  // ❌ дата в майбутньому - нічого не показуємо
  if (diffMs < 0) return ''

  const seconds = Math.floor(diffMs / 1000)

  // ✅ Щойно тільки < 60 секунд
  if (seconds < 60) return 'Щойно'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return pluralize(
      minutes,
      'хвилину тому',
      'хвилини тому',
      'хвилин тому'
    )
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return pluralize(
      hours,
      'годину тому',
      'години тому',
      'годин тому'
    )
  }

  const days = Math.floor(hours / 24)
  return pluralize(
    days,
    'день тому',
    'дні тому',
    'днів тому'
  )
}


export const nanoid = number => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const getNanoId = customAlphabet(alphabet, number)

  return getNanoId()
}


export const getOrderNumber = () => {
  const alphabet = '123456789'
  const getNumber = customAlphabet(alphabet, 4)

  return getNumber()
}


// Функція для отримання повного URL зображення
export const getImageUrl = (fileName) => {
  if (!fileName) return '';
  // Якщо це вже data URL (preview) - повертаємо як є
  if (fileName.startsWith('data:')) return fileName;
  // Якщо це повний URL - повертаємо як є (для сумісності зі старими даними)
  if (fileName.startsWith('http')) return fileName;
  // Інакше - це ім'я файлу, додаємо базовий URL
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://cdn.formoteka.com';
  return `${baseUrl}/${fileName}`;
}


export const getColor = (color, opacity = 0.7) => {
  if (!color) return undefined

  // Конвертуємо opacity (0-1) в hex (00-FF)
  const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0').toUpperCase()

  // Якщо hex (#EC224B або #EC224BCC)
  if (color.startsWith('#')) {
    const hexWithoutAlpha = color.length > 7 ? color.slice(0, 7) : color
    return `${hexWithoutAlpha}${opacityHex}`
  }
  
  // Якщо rgb/rgba
  if (color.startsWith('rgb')) {
    // Видаляємо існуючу alpha якщо є
    const rgbOnly = color.replace(/rgba?\(/, 'rgba(').replace(/,?\s*[\d.]+\)$/, '')
    return `${rgbOnly}, ${opacity})`
  }
  
  return color
}


// export const getLogoUrl = form =>
//   `${STORAGE_URL}logo/${form?.logo}?${form?.logo_cache}`

// export const isJson = value => {
//   if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
//     return true
//   }

//   if (typeof value === 'string') {
//     try {
//       const parsed = JSON.parse(value)
//       return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
//     } catch (e) {
//       return false
//     }
//   }
//   return false
// }

export const toSlugify = text => slugify(text, { lower: true, replacement: '_', remove: /[*+~.()'"!:@]/g })

// export const fixedNumber = (number) => {
//   return Number.isInteger(number)
//     ? Number(number) // Display as integer
//     : number ? Number(number)?.toFixed(2) : 0.00 // Display with 2 decimal places
// }

// export const getCartLineItem = (cart, name) => {
//   return cart.find(item => item.lineItem.name === name)
// }

// export const getMessengerMessage = (order) => {
//   const textLineItems = order?.lineItems?.map(item =>
//     `▪ ${item.quantity} x ${item.lineItem.name} (${order?.currency}${item.lineItem.price})`).join('\n')

//     return `Order #${order?.order_number ?? 0}

// ${textLineItems}

// Total: ${order?.currency}${Number(order?.sum)?.toFixed(2)} (Qty: ${order?.lineItems?.length ?? 0})

// Customer: ${order?.name}
// +${order?.phone}

// Delivery Type: ${order?.delivery_methods} - ${order?.address ?? ''}
// ${order?.comment ?
// `
// Comment: ${order?.comment}
// ` : ''}
// ${order?.last_line_message ?
// `${order?.last_line_message}` : ''}`?.trim()
// }
