import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { customAlphabet } from 'nanoid'
import slugify from 'slugify'
import { STORAGE_URL } from '@/constants'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
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

export const getLogoUrl = form =>
  `${STORAGE_URL}logo/${form?.logo}?${form?.logo_cache}`

// export const convertNewlines = (text) => {
//   return text
//     // .replace(/\\n/g, '\n') // Normalize to \n
//     .replace(/\\n\\n/g, '<br /><br />')
//     .replace(/\\n/g, '<br />');
// }

export const isJson = value => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return true
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
    } catch (e) {
      return false
    }
  }
  return false
}

export const toSlugify = text => slugify(text, { lower: true, replacement: '_', remove: /[*+~.()'"!:@]/g })

export const fixedNumber = (number) => {
  return Number.isInteger(number)
    ? Number(number) // Display as integer
    : number ? Number(number)?.toFixed(2) : 0.00 // Display with 2 decimal places
}

export const getCartProduct = (cart, name) => {
  return cart.find(item => item.product.name === name)
}

export const getMessengerMessage = (order) => {
  const textProducts = order?.products?.map(item =>
    `▪ ${item.quantity} x ${item.product.name} (${order?.currency}${item.product.price})`).join('\n')

    return `Order #${order?.order_number ?? 0}

${textProducts}

Total: ${order?.currency}${Number(order?.sum)?.toFixed(2)} (Qty: ${order?.products?.length ?? 0})

Customer: ${order?.name}
+${order?.phone}

Delivery Type: ${order?.delivery_methods} - ${order?.address ?? ''}
${order?.comment ?
`
Comment: ${order?.comment}
` : ''}
${order?.last_line_message ?
`${order?.last_line_message}` : ''}`?.trim()
}

// export const isPayment = paymentDate => {
//   if (paymentDate) {
//     const today = new Date()
//     today.setHours(0, 0, 0, 0) // Get today's date without the time component
//     const endDate = new Date(paymentDate)

//     return endDate >= today
//   }

//   return false
// }

// export const isAvailableForms = countForms => {
//   return !countForms
//     ? true
//     : countForms < NUMBER_FREE_FORMS
// }
