"use client"

export function GdprWorldMap({ type }: { type: "events" | "flows" }) {
  return (
    <div className="relative h-[280px] w-full">
      {/* World Map SVG */}
      <svg viewBox="0 0 800 400" className="h-full w-full">
        {/* Simplified world map paths */}
        <path
          d="M 100 150 L 150 140 L 180 160 L 200 150 L 220 170 L 200 180 L 180 175 L 150 180 L 120 170 Z"
          fill="#1e3a4f"
          stroke="#2a5a6f"
          strokeWidth="1"
        />
        <path
          d="M 250 120 L 350 110 L 400 130 L 420 150 L 400 170 L 350 180 L 300 170 L 270 150 Z"
          fill="#1e3a4f"
          stroke="#2a5a6f"
          strokeWidth="1"
        />
        <path
          d="M 450 140 L 550 130 L 600 150 L 620 170 L 600 190 L 550 200 L 500 180 L 470 160 Z"
          fill="#1e3a4f"
          stroke="#2a5a6f"
          strokeWidth="1"
        />
        <path
          d="M 100 250 L 200 240 L 250 260 L 230 280 L 180 290 L 120 280 Z"
          fill="#1e3a4f"
          stroke="#2a5a6f"
          strokeWidth="1"
        />
        <path
          d="M 650 160 L 720 150 L 750 170 L 730 190 L 680 200 L 660 180 Z"
          fill="#1e3a4f"
          stroke="#2a5a6f"
          strokeWidth="1"
        />

        {/* Connection lines */}
        <line x1="180" y1="165" x2="350" y2="145" stroke="#10b981" strokeWidth="2" opacity="0.6" />
        <line x1="350" y1="145" x2="550" y2="165" stroke="#10b981" strokeWidth="2" opacity="0.6" />
        <line x1="550" y1="165" x2="700" y2="175" stroke="#10b981" strokeWidth="2" opacity="0.6" />
        <line x1="180" y1="165" x2="200" y2="265" stroke="#10b981" strokeWidth="2" opacity="0.6" />
        <line x1="350" y1="145" x2="200" y2="265" stroke="#10b981" strokeWidth="2" opacity="0.6" />

        {/* Dots at connection points */}
        <circle cx="180" cy="165" r="4" fill="#10b981" />
        <circle cx="350" cy="145" r="4" fill="#10b981" />
        <circle cx="550" cy="165" r="4" fill="#10b981" />
        <circle cx="700" cy="175" r="4" fill="#10b981" />
        <circle cx="200" cy="265" r="4" fill="#10b981" />
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-2 text-xs text-gray-400">
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
        <span>Destination Country/Region</span>
      </div>
    </div>
  )
}
