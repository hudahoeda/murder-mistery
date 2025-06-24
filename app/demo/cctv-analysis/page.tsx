'use client';

import { Metadata } from 'next'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Camera, Settings, Search, Users } from 'lucide-react'
import Link from 'next/link'
import CCTVImageAnalysis from '@/components/puzzles/CCTVImageAnalysis'

export default function CCTVAnalysisDemoPage() {
  const handlePuzzleComplete = (success: boolean, timeSpent: number) => {
    console.log('CCTV Analysis Demo completed:', { success, timeSpent })
    alert(`Demo completed! Success: ${success}, Time: ${timeSpent}s`)
  }

  const handleHintUsed = () => {
    console.log('Hint requested in CCTV Analysis demo')
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
              <h1 className="text-xl font-bold text-amber-100">CCTV Image Analysis Demo</h1>
              <p className="text-sm text-slate-400">Canvas-based Image Enhancement System</p>
            </div>
          </div>
          
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            Interactive Demo
          </Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Demo Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-amber-100 flex items-center gap-3">
              <Camera className="w-6 h-6 text-blue-500" />
              CCTV Image Analysis Puzzle Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-300">
                This demo showcases the CCTV Image Analysis puzzle with interactive image enhancement tools, 
                brand identification database, and ownership correlation features.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4 text-blue-400" />
                    <h3 className="font-semibold text-blue-200">Step 1: Image Enhancement</h3>
                  </div>
                  <p className="text-blue-100 text-sm">
                    Use Canvas-based sliders to adjust brightness, contrast, saturation, and blur to reveal hidden details in CCTV footage.
                  </p>
                </div>
                
                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4 text-indigo-400" />
                    <h3 className="font-semibold text-indigo-200">Step 2: Brand Identification</h3>
                  </div>
                  <p className="text-indigo-100 text-sm">
                    Compare enhanced image with tool brand database to identify the specific wrench model and manufacturer.
                  </p>
                </div>
                
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-orange-400" />
                    <h3 className="font-semibold text-orange-200">Step 3: Ownership Correlation</h3>
                  </div>
                  <p className="text-orange-100 text-sm">
                    Cross-reference identified tool with suspect profiles and station inventory to determine legitimate access.
                  </p>
                </div>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-amber-200 mb-2">Demo Features:</h3>
                <ul className="text-amber-100 space-y-1 text-sm">
                  <li>• Real-time Canvas image processing with filter effects</li>
                  <li>• Interactive slider controls for brightness, contrast, saturation, and blur</li>
                  <li>• Visual feedback when optimal enhancement settings are achieved</li>
                  <li>• Brand comparison database with distinctive characteristics</li>
                  <li>• Suspect tool inventory cross-referencing system</li>
                  <li>• Multi-step validation with contextual hints</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Puzzle Demo */}
        <Suspense fallback={
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-slate-400">Loading CCTV Analysis Demo...</div>
            </CardContent>
          </Card>
        }>
          <CCTVImageAnalysis 
            onComplete={handlePuzzleComplete}
            onHintUsed={handleHintUsed}
          />
        </Suspense>
      </div>
    </div>
  )
} 