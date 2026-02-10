import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/utils"

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]
const MONTHS = [
  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
]

function Calendar({
  selected,
  onSelect,
  disabled,
  accentColor,
  className,
}) {
  const [currentDate, setCurrentDate] = React.useState(selected || new Date())
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }
  
  const handleDateClick = (day, monthOffset) => {
    if (disabled) return
    
    const targetMonth = month + monthOffset
    const newDate = new Date(year, targetMonth, day)
    onSelect?.(newDate)
  }
  
  const isSelected = (day, monthOffset) => {
    if (!selected) return false
    const compareMonth = month + monthOffset
    const compareYear = year + Math.floor(compareMonth / 12)
    const normalizedMonth = ((compareMonth % 12) + 12) % 12
    
    return (
      selected.getDate() === day &&
      selected.getMonth() === normalizedMonth &&
      selected.getFullYear() === compareYear
    )
  }
  
  const isToday = (day, monthOffset) => {
    const today = new Date()
    const compareMonth = month + monthOffset
    const compareYear = year + Math.floor(compareMonth / 12)
    const normalizedMonth = ((compareMonth % 12) + 12) % 12
    
    return (
      today.getDate() === day &&
      today.getMonth() === normalizedMonth &&
      today.getFullYear() === compareYear
    )
  }
  
  const days = []
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      monthOffset: -1,
    })
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      monthOffset: 0,
    })
  }
  
  // Next month days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      monthOffset: 1,
    })
  }
  
  return (
    <div 
      className={cn("p-4 rounded-[10px]", className)}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.7)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={disabled}
          className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-black/10 transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="text-base font-semibold">
          {MONTHS[month]} {year}
        </div>
        
        <button
          onClick={nextMonth}
          disabled={disabled}
          className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-black/10 transition-colors disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((item, index) => {
          const selectedDay = isSelected(item.day, item.monthOffset)
          const today = isToday(item.day, item.monthOffset)
          const isCurrentMonth = item.monthOffset === 0
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(item.day, item.monthOffset)}
              disabled={disabled}
              className={cn(
                "h-10 w-10 rounded-full text-sm font-normal inline-flex items-center justify-center transition-colors",
                "hover:bg-black/10",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                !isCurrentMonth && "text-muted-foreground opacity-50",
                today && !selectedDay && "bg-black/5 font-semibold",
                selectedDay && "text-[#FAFAFA] font-semibold"
              )}
              style={
                selectedDay
                  ? { backgroundColor: '#2F3032' }
                  : undefined
              }
            >
              {item.day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
