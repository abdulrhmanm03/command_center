export function SeverityList() {
  const offenses = [
    {
      magnitude: 8,
      description: "Remote Inbound Communication from Third Countries/Regions containing WebSecu...",
      color: "bg-red-500",
    },
    {
      magnitude: 6,
      description: "Remote Inbound Communication from Third Countries/Regions containing WebSecu...",
      color: "bg-orange-500",
    },
    {
      magnitude: 5,
      description: "Personal Data Transferred to Third Countries/Regions preceded by Data Exfiltration ...",
      color: "bg-yellow-500",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[auto_1fr] gap-4 text-xs text-gray-400">
        <div>Magnitude</div>
        <div>Description</div>
      </div>
      {offenses.map((offense, index) => (
        <div key={index} className="grid grid-cols-[auto_1fr] gap-4 items-start">
          <div className="flex items-center gap-2">
            <div className={`h-12 w-1 ${offense.color}`}></div>
            <span className="text-white font-semibold">{offense.magnitude}</span>
          </div>
          <div className="text-sm text-gray-300 leading-relaxed">{offense.description}</div>
        </div>
      ))}
    </div>
  )
}
