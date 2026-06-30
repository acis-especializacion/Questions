const COLORS = [
   { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
   { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
   { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
   { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
   { bg: '#EDE9FE', text: '#5B21B6', dot: '#8B5CF6' },
   { bg: '#FCE7F3', text: '#9D174D', dot: '#EC4899' },
   { bg: '#CFFAFE', text: '#155E75', dot: '#06B6D4' },
   { bg: '#FFEDD5', text: '#9A3412', dot: '#F97316' },
   { bg: '#E0E7FF', text: '#3730A3', dot: '#6366F1' },
   { bg: '#CCFBF1', text: '#115E59', dot: '#14B8A6' },
]

export function getTeacherColor(index: number) {
   return COLORS[index % COLORS.length]
}

export function getInitials(name: string) {
   const parts = name.trim().split(/\s+/)
   if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
   return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
