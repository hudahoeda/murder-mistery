'use client';

import { Metadata } from 'next'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calculator, Calendar, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import MathematicalScheduleAnalysis from '@/components/puzzles/MathematicalScheduleAnalysis'

export default function MathematicalAnalysisDemoPage() {
  const handlePuzzleComplete = (success: boolean, timeSpent: number) => {
    console.log('Mathematical Analysis Demo completed:', { success, timeSpent })
    alert(`Demo completed! Success: ${success}, Time: ${timeSpent}s`)
  }

  const handleHintUsed = () => {
    console.log('Hint requested in Mathematical Analysis demo')
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-slate-400" asChild>
              <Link href="/demo">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Demos
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-amber-100">Mathematical Schedule Analysis Demo</h1>
              <p className="text-sm text-slate-400">Calculations & Statistical Analysis System</p>
            </div>
          </div>
          
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            Interactive Demo
          </Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Demo Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-amber-100 flex items-center gap-3">
              <Calculator className="w-6 h-6 text-purple-500" />
              Mathematical Schedule Analysis Puzzle Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-300">
                This demo showcases the Mathematical Schedule Analysis puzzle with train schedule calculations, 
                staff correlation analysis, and passenger flow anomaly detection.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <h3 className="font-semibold text-blue-200">Step 1: Time Calculations</h3>
                  </div>
                  <p className="text-blue-100 text-sm">
                    Calculate train departure conflicts considering delays and minimum interval requirements between services.
                  </p>
                </div>
                
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-green-400" />
                    <h3 className="font-semibold text-green-200">Step 2: Staff Correlation</h3>
                  </div>
                  <p className="text-green-100 text-sm">
                    Analyze staff work schedules to identify who had access to critical areas during the murder timeframe.
                  </p>
                </div>
                
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-orange-400" />
                    <h3 className="font-semibold text-orange-200">Step 3: Passenger Anomaly</h3>
                  </div>
                  <p className="text-orange-100 text-sm">
                    Statistical analysis of passenger flow data to identify significant anomalies during the incident period.
                  </p>
                </div>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-amber-200 mb-2">Demo Features:</h3>
                <ul className="text-amber-100 space-y-1 text-sm">
                  <li>• Interactive train schedule tables with delay calculations</li>
                  <li>• Step-by-step mathematical problem solving with constraints</li>
                  <li>• Staff schedule matrix with duty/break time analysis</li>
                  <li>• Color-coded shift overlaps and access privilege indicators</li>
                  <li>• Passenger flow charts with statistical variance analysis</li>
                  <li>• Anomaly detection with configurable significance thresholds</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Puzzle Demo */}
        <Suspense fallback={
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-slate-400">Loading Mathematical Analysis Demo...</div>
            </CardContent>
          </Card>
        }>
          <MathematicalScheduleAnalysis 
            onComplete={handlePuzzleComplete}
            onHintUsed={handleHintUsed}
          />
        </Suspense>
      </div>
    </div>
  )
} 