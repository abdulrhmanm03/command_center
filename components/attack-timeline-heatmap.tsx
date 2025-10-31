"use client"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const hours = ["00", "04", "08", "12", "16", "20"]

// Generate heatmap data (0-100 intensity)
const generateHeatmapData = () => {
  const data: number[][] = []
  for (let i = 0; i < days.length; i++) {
    const row: number[] = []
    for (let j = 0; j < hours.length; j++) {
      // Simulate higher activity during business hours
      const baseIntensity = j >= 2 && j <= 4 ? 60 : 30
      row.push(Math.floor(Math.random() * 40) + baseIntensity)
    }
    data.push(row)
  }
  return data
}

const heatmapData = generateHeatmapData()

const getColor = (intensity: number) => {
  if (intensity >= 80) return "bg-destructive"
  if (intensity >= 60) return "bg-warning"
  if (intensity >= 40) return "bg-primary"
  if (intensity >= 20) return "bg-accent"
  return "bg-muted"
}

export function AttackTimelineHeatmap() {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="w-12" />
        {hours.map((hour) => (
          <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
            {hour}:00
          </div>
        ))}
      </div>
      {days.map((day, dayIndex) => (
        <div key={day} className="flex gap-2">
          <div className="w-12 text-xs text-muted-foreground flex items-center">{day}</div>
          {hours.map((hour, hourIndex) => (
            <div
              key={`${day}-${hour}`}
              className={`flex-1 h-8 rounded ${getColor(heatmapData[dayIndex][hourIndex])} transition-all hover:ring-2 hover:ring-primary cursor-pointer`}
              title={`${day} ${hour}:00 - ${heatmapData[dayIndex][hourIndex]} attacks`}
            />
          ))}
        </div>
      ))}
      <div className="flex items-center justify-end gap-2 pt-2">
        <span className="text-xs text-muted-foreground">Less</span>
        <div className="h-3 w-3 rounded bg-muted" />
        <div className="h-3 w-3 rounded bg-accent" />
        <div className="h-3 w-3 rounded bg-primary" />
        <div className="h-3 w-3 rounded bg-warning" />
        <div className="h-3 w-3 rounded bg-destructive" />
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  )
}
