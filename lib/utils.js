import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
