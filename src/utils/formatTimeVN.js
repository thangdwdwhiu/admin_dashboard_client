export function formatTimeVN(utcTime) {
  if (!utcTime) return ""

  const now = new Date()
  const time = new Date(utcTime) // JS auto convert UTC → local

  const diffMs = now - time
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 30) return "Vừa xong"
  if (diffMin < 1) return `${diffSec} giây trước`
  if (diffMin < 60) return `${diffMin} phút trước`
  if (diffHour < 24) return `${diffHour} giờ trước`

  if (diffDay === 1) {
    return `Hôm qua lúc ${time.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`
  }

  return time.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
