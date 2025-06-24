import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Train, Puzzle, Lock, Users, Move, RotateCcw, Eye, Calendar, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Interactive Puzzle Demos - Murder Mystery at Stasiun Manggarai',
  description: 'Experience all 4 completed interactive puzzles with advanced features and multi-step progression.',
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-slate-400" asChild>
              <Link href="/game">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Game
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-amber-100">Interactive Puzzle Demos</h1>
              <p className="text-sm text-slate-400">Phase 2: Advanced Investigation Components</p>
            </div>
          </div>
          
          <Badge variant="outline" className="text-green-400 border-green-400">
            4/6 Puzzles Complete 🎉
          </Badge>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Demo Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-100 flex items-center gap-3">
              <Play className="w-6 h-6 text-amber-500" />
              Phase 2 Interactive Puzzle Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-200 mb-4">Demo System Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-200">✅ Interactive Components:</h4>
                    <ul className="text-green-100 space-y-1 text-sm">
                      <li>• Drag & drop luggage tag assembly</li>
                      <li>• Interactive Caesar cipher wheel</li>
                      <li>• SVG station map with hotspots</li>
                      <li>• Text highlighting & timeline construction</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-200">🎯 Testing Features:</h4>
                    <ul className="text-green-100 space-y-1 text-sm">
                      <li>• Multi-step puzzle progression</li>
                      <li>• Real-time validation & feedback</li>
                      <li>• Mobile-responsive touch controls</li>
                      <li>• Performance analytics & timing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-slate-300 mb-4">
                  Experience each puzzle individually to test specific features and interactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Puzzle Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Train Schedule Investigation Demo */}
          <Card className="bg-slate-800/60 border-slate-700 hover:border-amber-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-amber-100 flex items-center gap-3">
                <Train className="w-6 h-6 text-amber-500" />
                Train Schedule Investigation
              </CardTitle>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-200 border-green-500">
                  ✓ Complete
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-200 border-blue-500">
                  3 Steps
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-300 text-sm">
                  Multi-step investigation with platform identification, schedule analysis, and passenger manifest searching.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle className="w-3 h-3" />
                    Platform identification with CCTV analysis
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle className="w-3 h-3" />
                    Time calculations with delay analysis
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle className="w-3 h-3" />
                    Searchable passenger database
                  </div>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Key Features:</div>
                  <div className="text-sm text-blue-400">Radio groups, data tables, search components</div>
                </div>

                <Button asChild className="w-full bg-amber-500 text-slate-900 hover:bg-amber-400">
                  <Link href="/demo/train-schedule">
                    <Play className="w-4 h-4 mr-2" />
                    Test Train Schedule Demo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lost Luggage Cipher Demo */}
          <Card className="bg-slate-800/60 border-slate-700 hover:border-amber-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-amber-100 flex items-center gap-3">
                <Puzzle className="w-6 h-6 text-amber-500" />
                Lost Luggage Cipher
              </CardTitle>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-200 border-green-500">
                  ✓ Complete
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-500">
                  Advanced
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-300 text-sm">
                  Advanced puzzle with drag & drop assembly, interactive cipher wheel, and security access panel.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Move className="w-3 h-3" />
                    Drag & drop with @dnd-kit/sortable
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <RotateCcw className="w-3 h-3" />
                    CSS transform cipher wheel
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Lock className="w-3 h-3" />
                    OTP security access system
                  </div>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Key Features:</div>
                  <div className="text-sm text-purple-400">Interactive components, real-time validation</div>
                </div>

                <Button asChild className="w-full bg-amber-500 text-slate-900 hover:bg-amber-400">
                  <Link href="/demo/lost-luggage">
                    <Play className="w-4 h-4 mr-2" />
                    Test Luggage Cipher Demo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Station Environment Riddle Demo */}
          <Card className="bg-slate-800/60 border-slate-700 hover:border-amber-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-amber-100 flex items-center gap-3">
                <Eye className="w-6 h-6 text-amber-500" />
                Station Environment Riddle
              </CardTitle>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-200 border-green-500">
                  ✓ Complete
                </Badge>
                <Badge className="bg-indigo-500/20 text-indigo-200 border-indigo-500">
                  SVG + 360°
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-300 text-sm">
                  Location-based riddle with interactive SVG station map and 360° panoramic evidence discovery.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle className="w-3 h-3" />
                    Interactive riddle solving
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle className="w-3 h-3" />
                    SVG map with clickable areas
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Eye className="w-3 h-3" />
                    360° panoramic crime scene
                  </div>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Key Features:</div>
                  <div className="text-sm text-indigo-400">SVG interactions, panoramic viewer</div>
                </div>

                <Button asChild className="w-full bg-amber-500 text-slate-900 hover:bg-amber-400">
                  <Link href="/demo/station-riddle">
                    <Play className="w-4 h-4 mr-2" />
                    Test Station Riddle Demo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Witness Statement Analysis Demo */}
          <Card className="bg-slate-800/60 border-slate-700 hover:border-amber-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-amber-100 flex items-center gap-3">
                <Users className="w-6 h-6 text-amber-500" />
                Witness Statement Analysis
              </CardTitle>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-200 border-green-500">
                  ✓ Complete
                </Badge>
                <Badge className="bg-pink-500/20 text-pink-200 border-pink-500">
                  Text + Timeline
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-300 text-sm">
                  Advanced text analysis with highlighting, evidence cross-referencing, and timeline construction.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle className="w-3 h-3" />
                    Dynamic text highlighting
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle className="w-3 h-3" />
                    Evidence cross-referencing
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" />
                    Interactive timeline construction
                  </div>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Key Features:</div>
                  <div className="text-sm text-pink-400">Text processing, contradiction detection</div>
                </div>

                <Button asChild className="w-full bg-amber-500 text-slate-900 hover:bg-amber-400">
                  <Link href="/demo/witness-analysis">
                    <Play className="w-4 h-4 mr-2" />
                    Test Witness Analysis Demo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Development Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl text-amber-100">Demo System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">4/6</div>
                <div className="text-sm text-slate-400">Puzzles Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">12</div>
                <div className="text-sm text-slate-400">Interactive Steps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">800+</div>
                <div className="text-sm text-slate-400">Lines of Code</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">67%</div>
                <div className="text-sm text-slate-400">Phase 2 Progress</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-200 text-sm">
                <strong>Next Steps:</strong> CCTV Image Analysis (Canvas-based enhancement) and Mathematical Schedule Analysis (calculations + statistics) to complete Phase 2.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 