"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"

interface Employee {
  id: string
  name: string
  department: string
  riskScore: number
  departureDate: string
}

export function DepartingEmployeesPanel() {
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    const generateEmployees = (): Employee[] => {
      const names = [
        { name: "Harry Ogwa", dept: "Mainframe and Midrange Administration" },
        { name: "Lara Bade", dept: "IT" },
        { name: "Timothy Fitzsimons", dept: "Processing and Fulfillment" },
      ]

      return names.map((emp, index) => ({
        id: `emp-${index}`,
        name: emp.name,
        department: emp.dept,
        riskScore: 100 + Math.random() * 30,
        departureDate: `JAN ${10 + index * 3}`,
      }))
    }

    setEmployees(generateEmployees())
    const interval = setInterval(() => {
      setEmployees(generateEmployees())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-3">
      {employees.map((employee) => (
        <div
          key={employee.id}
          className="flex items-center gap-3 p-3 rounded-lg border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 transition-colors"
        >
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <User className="h-5 w-5 text-orange-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="font-semibold text-sm text-orange-400">{employee.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{employee.department}</p>
                <p className="text-xs text-muted-foreground mt-1">{employee.departureDate}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-orange-400">{employee.riskScore.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">RISK SCORE</div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="text-xs text-muted-foreground text-center pt-2">
        SHOWING {employees.length} OF {employees.length} RECORDS
      </div>
    </div>
  )
}
