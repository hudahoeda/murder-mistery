import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Puzzle, Train, RotateCcw, Lock, Move, Sparkles, CheckCircle, Zap, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Phase 2 Investigation - Murder Mystery at Stasiun Manggarai',
  description: 'Experience advanced interactive puzzles with drag & drop, cipher wheels, and multi-step investigations.',
}

export default function GamePage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-slate-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-xl font-bold text-amber-100">Murder Mystery Investigation</h1>
              <p className="text-sm text-slate-400">Stasiun Manggarai Railway Station</p>
            </div>
          </div>
          
          <Badge variant="outline" className="text-green-400 border-green-400">
            Phase 2: 4/6 Puzzles Complete! 🎉
          </Badge>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Main Investigation Briefing */}
        <Card className="puzzle-container mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-100 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-500" />
              Phase 2: Advanced Interactive Investigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-200 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Major Milestone Achieved!
                </h3>
                <p className="text-green-100 leading-relaxed mb-4">
                  <strong className="text-green-200">Phase 2 Status:</strong> We've successfully implemented 
                  4 out of 6 enhanced puzzles with sophisticated interactive components including drag & drop 
                  systems, interactive cipher wheels, text analysis, and timeline construction.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-200">✅ Completed Puzzles:</h4>
                    <ul className="text-green-100 space-y-1 text-sm">
                      <li>• Train Schedule Investigation (3 interactive steps)</li>
                      <li>• Lost Luggage Cipher (drag & drop + cipher wheel)</li>
                      <li>• Station Environment Riddle (SVG map + 360° viewer)</li>
                      <li>• Witness Statement Analysis (text + timeline)</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-200">🔄 Next Priority:</h4>
                    <ul className="text-green-100 space-y-1 text-sm">
                      <li>• CCTV Image Analysis (canvas + enhancement)</li>
                      <li>• Mathematical Schedule Analysis (calculations)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  size="lg"
                  className="bg-amber-500 text-slate-900 hover:bg-amber-400 text-lg px-8 py-3"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Experience Advanced Puzzles
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Puzzle Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Train Schedule Investigation */}
          <Card className="bg-slate-800/60 border-slate-700 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-amber-100 flex items-center gap-3">
                <Train className="w-6 h-6 text-amber-500" />
                Train Schedule Investigation
              </CardTitle>
              <Badge className="bg-green-500/20 text-green-200 border-green-500 w-fit">
                ✓ Complete - 3 Steps
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Platform identification with CCTV analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Interactive schedule analysis with time calculations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Searchable passenger manifest database</span>
                  </div>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded p-3">
                  <div className="text-xs text-slate-400 mb-2">Sample Evidence:</div>
                  <div className="text-sm text-blue-400">19:45 Bekasi - Delayed 10 min</div>
                  <div className="text-xs text-slate-300 mt-1">
                    "Pak Rahman saw the victim checking his watch repeatedly..."
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lost Luggage Cipher */}
          <Card className="bg-slate-800/60 border-slate-700 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-amber-100 flex items-center gap-3">
                <Puzzle className="w-6 h-6 text-amber-500" />
                Lost Luggage Cipher
                <Sparkles className="w-4 h-4 text-amber-400" />
              </CardTitle>
              <Badge className="bg-green-500/20 text-green-200 border-green-500 w-fit">
                ✓ Complete - Advanced Interactions
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Drag & drop luggage tag assembly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Interactive Caesar cipher wheel rotation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Evidence locker access with 4-digit OTP</span>
                  </div>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded p-3">
                  <div className="text-xs text-slate-400 mb-2">Decoded Message:</div>
                  <div className="font-mono text-green-300 text-sm">MEET AT STORE ROOM</div>
                  <div className="text-xs text-slate-300 mt-1">
                    Access Code: <span className="font-mono">2015</span> (20:15 military time)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Station Environment Riddle */}
          <Card className="bg-slate-800/60 border-slate-700 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-amber-100 flex items-center gap-3">
                <Lock className="w-6 h-6 text-amber-500" />
                Station Environment Riddle
              </CardTitle>
              <Badge className="bg-green-500/20 text-green-200 border-green-500 w-fit">
                ✓ Complete - SVG Map + 360°
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Interactive riddle solving system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">SVG station map with clickable depot areas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">360° panoramic evidence discovery</span>
                  </div>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded p-3">
                  <div className="text-xs text-slate-400 mb-2">Riddle Solution:</div>
                  <div className="text-sm text-purple-400">Train Maintenance Depot A</div>
                  <div className="text-xs text-slate-300 mt-1">
                    Evidence Found: <span className="text-red-400">Bloodstained wrench</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Witness Statement Analysis */}
          <Card className="bg-slate-800/60 border-slate-700 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-amber-100 flex items-center gap-3">
                <Users className="w-6 h-6 text-amber-500" />
                Witness Statement Analysis
                <Sparkles className="w-4 h-4 text-amber-400" />
              </CardTitle>
              <Badge className="bg-green-500/20 text-green-200 border-green-500 w-fit">
                ✓ Complete - Text Analysis + Timeline
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Interactive text highlighting system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Evidence cross-referencing with CCTV logs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Timeline construction with contradiction detection</span>
                  </div>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded p-3">
                  <div className="text-xs text-slate-400 mb-2">Key Finding:</div>
                  <div className="text-sm text-red-400">Rahman's alibi contradiction</div>
                  <div className="text-xs text-slate-300 mt-1">
                    Time Gap: <span className="font-mono">20:15-20:25</span> (near storage area)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Features Demo */}
        <Card className="puzzle-container mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-amber-100 flex items-center gap-3">
              <Move className="w-5 h-5 text-amber-500" />
              Advanced Interactive Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center">
                  <Move className="w-8 h-8 text-amber-500" />
                </div>
                <h4 className="font-semibold text-amber-100">Drag & Drop</h4>
                <p className="text-sm text-slate-300">
                  Interactive luggage tag assembly with @dnd-kit/sortable, 
                  real-time validation, and smooth animations.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-8 h-8 text-amber-500" />
                </div>
                <h4 className="font-semibold text-amber-100">Cipher Wheel</h4>
                <p className="text-sm text-slate-300">
                  CSS transform-based rotation with live Caesar cipher decoding 
                  and mathematical shift calculations.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-amber-500" />
                </div>
                <h4 className="font-semibold text-amber-100">Security Access</h4>
                <p className="text-sm text-slate-300">
                  Professional OTP input system with time-based validation 
                  and secure access panel interface.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Next */}
        <Card className="puzzle-container">
          <CardHeader>
            <CardTitle className="text-xl text-amber-100 flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-500" />
              Coming Next in Phase 2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-100 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Station Environment Riddle
                  </h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• Interactive riddle solving system</li>
                    <li>• SVG station map with clickable hotspots</li>
                    <li>• Three.js 360° crime scene exploration</li>
                    <li>• Multi-step evidence discovery flow</li>
                  </ul>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-100 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Remaining Enhancements
                  </h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• Witness statement text highlighting</li>
                    <li>• Interactive timeline construction</li>
                    <li>• CCTV image enhancement tools</li>
                    <li>• Mathematical analysis widgets</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-4 bg-slate-800/60 border border-slate-700 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-amber-500">4/6</div>
                    <div className="text-xs text-slate-400">Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-amber-500">67%</div>
                    <div className="text-xs text-slate-400">Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-amber-500">12</div>
                    <div className="text-xs text-slate-400">Steps Built</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-amber-500">800+</div>
                    <div className="text-xs text-slate-400">Lines Code</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  size="lg"
                  className="bg-amber-500 text-slate-900 hover:bg-amber-400 text-lg px-8 py-3"
                >
                  Continue Building Phase 2
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 