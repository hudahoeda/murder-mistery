import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Timer } from '@/components/game/Timer'
import { ClueReveal } from '@/components/game/ClueReveal'

import { 
  Users, 
  Clock, 
  MapPin, 
  Search, 
  Puzzle, 
  Trophy,
  Train,
  Eye,
  AlertTriangle,
  CheckCircle,
  Zap,
  RotateCcw,
  Lock,
  Move,
  Sparkles
} from 'lucide-react'

// Sample clue for demonstration
const sampleClue = {
  id: "demo-clue",
  title: "Secret Meeting Decoded",
  content: "The Caesar cipher found on the reconstructed luggage tag reveals a hidden message: 'MEET AT STORE ROOM'. This suggests a pre-planned clandestine meeting between the victim and someone else.",
  category: "evidence" as const,
  revealCondition: {
    puzzleId: "lost-luggage-cipher", 
    stepId: "caesar-cipher-decoding"
  },
  importance: "critical" as const,
  relatedSuspects: ["agus-santoso"],
  relatedEvidence: ["luggage-tag-fragments", "storage-room-keycard"]
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="outline" className="text-amber-500 border-amber-500 mb-4">
              Phase 2: Major Milestone Achieved! 🎉
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-amber-100 mb-6 leading-tight">
              Murder Mystery at
              <span className="block text-amber-500">Stasiun Manggarai</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              <strong className="text-amber-400">Now featuring advanced interactive puzzles!</strong> 
              Experience drag & drop tag assembly, interactive cipher wheels, and sophisticated multi-step investigations.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button size="lg" className="bg-amber-500 text-slate-900 hover:bg-amber-400 text-lg px-8 py-3">
              <Sparkles className="w-5 h-5 mr-2" />
              Try Advanced Puzzles
            </Button>
            <Button size="lg" variant="outline" className="text-amber-400 border-amber-400 hover:bg-amber-400/10 text-lg px-8 py-3">
              <Move className="w-5 h-5 mr-2" />
              View Drag & Drop Demo
            </Button>
          </div>

          {/* Phase 2 Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">2/6</div>
              <div className="text-slate-400">Puzzles Complete</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">9</div>
              <div className="text-slate-400">Interactive Steps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">527</div>
              <div className="text-slate-400">Lines of Code</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">33%</div>
              <div className="text-slate-400">Phase Progress</div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 2 Major Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">Phase 2: Advanced Interactive Components</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              <strong className="text-amber-400">Major Achievement:</strong> 2 out of 6 enhanced puzzles now complete with sophisticated interactions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-amber-100 flex items-center gap-3">
                  <Train className="w-6 h-6 text-amber-500" />
                  Train Schedule Investigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Platform identification with CCTV analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Interactive schedule analysis & calculations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Searchable passenger manifest database</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-200 border-green-500 w-full justify-center">
                    ✓ Complete - 3 Interactive Steps
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 border-slate-700 border-amber-500/50">
              <CardHeader>
                <CardTitle className="text-amber-100 flex items-center gap-3">
                  <Puzzle className="w-6 h-6 text-amber-500" />
                  Lost Luggage Cipher
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Drag & drop tag assembly system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Interactive Caesar cipher wheel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Evidence locker access with OTP</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-200 border-green-500 w-full justify-center">
                    ✓ Complete - Advanced Interactions
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-amber-100 flex items-center gap-3">
                  <Search className="w-6 h-6 text-amber-500" />
                  Next: Station Environment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-slate-300">Interactive riddle system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-slate-300">SVG station map with hotspots</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-slate-300">Three.js 360° crime scene</span>
                  </div>
                  <Badge variant="outline" className="text-amber-400 border-amber-400 w-full justify-center">
                    🔄 Ready to Build Next
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Interactive Demo Section */}
      <section className="py-16 px-6 bg-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">Advanced Puzzle Interactions</h2>
            <p className="text-slate-300 text-lg">Experience our sophisticated puzzle components with real interactions</p>
          </div>

          <div className="space-y-8">
            {/* Enhanced Demo Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-100 flex items-center gap-2">
                  <Move className="w-5 h-5" />
                  Drag & Drop Assembly
                </h3>
                <Card className="bg-slate-800/60 border-slate-700">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="text-sm text-slate-400 mb-3">Luggage Tag Pieces:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {['LUG', 'GE-', '457', 'BEK', 'ASI'].map((piece, i) => (
                          <div key={i} className="p-2 bg-slate-700 border border-slate-500 rounded text-center font-mono text-sm">
                            {piece}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-slate-400 mt-2">
                        → Reconstructed: <span className="font-mono text-amber-300">LUGGE-457BEKASI</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <p className="text-slate-400 text-sm">
                  Interactive drag & drop with @dnd-kit/sortable, real-time validation, and visual feedback.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-100 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  Caesar Cipher Wheel
                </h3>
                <Card className="bg-slate-800/60 border-slate-700">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-amber-500 bg-slate-700 flex items-center justify-center">
                          <div className="text-xs font-mono text-amber-200">A→T B→U C→V</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400">Encrypted:</div>
                        <div className="font-mono text-red-300 text-sm">PHHW DW VWRUH</div>
                        <div className="text-xs text-slate-400 mt-1">Decoded (shift 7):</div>
                        <div className="font-mono text-green-300 text-sm">MEET AT STORE</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <p className="text-slate-400 text-sm">
                  CSS transform-based rotation with live decoding and mathematical cipher implementation.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-100 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Evidence Locker Access
                </h3>
                <Card className="bg-slate-800/60 border-slate-700">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-slate-700 rounded-full flex items-center justify-center">
                          <Lock className="w-6 h-6 text-amber-500" />
                        </div>
                        <div className="text-sm text-slate-300 mb-2">Security Access Panel</div>
                        <div className="font-mono text-lg tracking-widest bg-slate-900 p-2 rounded border">
                          2015
                        </div>
                        <div className="text-xs text-green-400 mt-2">
                          ✓ ACCESS GRANTED
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <p className="text-slate-400 text-sm">
                  OTP input system with time-based validation and professional security interface design.
                </p>
              </div>
            </div>

            {/* Enhanced Clue System */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-amber-100 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Enhanced Clue Discovery
              </h3>
              <ClueReveal clue={sampleClue} isRevealed={true} showAnimation={false} />
              <p className="text-slate-400 text-sm text-center">
                Smart clue system with evidence correlation, suspect linking, and progressive revelation based on puzzle completion.
              </p>
            </div>

            {/* Advanced Puzzle Preview */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-amber-100 text-center">
                Multi-Step Puzzle Experience
              </h3>
              <div className="max-w-4xl mx-auto">
                <Card className="puzzle-container">
                  <CardHeader>
                    <CardTitle className="text-amber-100 flex items-center gap-2">
                      <Puzzle className="w-5 h-5" />
                      Lost Luggage Cipher - Step Progression Demo
                    </CardTitle>
                    <p className="text-slate-300">Experience the complete multi-step puzzle flow</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                          <h4 className="font-semibold text-green-200 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Step 1: Tag Assembly
                          </h4>
                          <div className="text-sm text-green-100 space-y-1">
                            <div>✓ Drag & drop interface</div>
                            <div>✓ Real-time validation</div>
                            <div>✓ Visual reconstruction</div>
                          </div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                          <h4 className="font-semibold text-green-200 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Step 2: Cipher Decoding
                          </h4>
                          <div className="text-sm text-green-100 space-y-1">
                            <div>✓ Interactive cipher wheel</div>
                            <div>✓ Live text decoding</div>
                            <div>✓ Mathematical validation</div>
                          </div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                          <h4 className="font-semibold text-green-200 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Step 3: Access Code
                          </h4>
                          <div className="text-sm text-green-100 space-y-1">
                            <div>✓ Time-based OTP system</div>
                            <div>✓ Security panel interface</div>
                            <div>✓ Success animations</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Badge variant="outline" className="text-amber-400 border-amber-400">
                          🎉 Both Advanced Puzzles Now Live in Game Mode
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 2 Accurate Progress */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">Phase 2 Development Progress</h2>
            <p className="text-slate-300 text-lg">Building the future of interactive investigation games</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Train Schedule Investigation", progress: 100, status: "Complete", features: "3 interactive steps" },
              { name: "Lost Luggage Cipher", progress: 100, status: "Complete", features: "Drag & drop + cipher wheel" },
              { name: "Station Environment Riddle", progress: 20, status: "Next Priority", features: "SVG map + 360° viewer" },
              { name: "Witness Statement Analysis", progress: 10, status: "Designed", features: "Text highlighting + timeline" },
              { name: "CCTV Image Analysis", progress: 10, status: "Designed", features: "Canvas enhancement + recognition" },
              { name: "Mathematical Schedule Analysis", progress: 10, status: "Designed", features: "Interactive calculations" }
            ].map((puzzle, index) => (
              <Card key={index} className={`bg-slate-800/60 border-slate-700 ${puzzle.status === 'Complete' ? 'border-green-500/30' : ''}`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-amber-100 text-sm">{puzzle.name}</h3>
                      <Badge variant="outline" className={`text-xs ${
                        puzzle.status === 'Complete' ? 'text-green-400 border-green-400' :
                        puzzle.status === 'Next Priority' ? 'text-amber-400 border-amber-400' :
                        'text-slate-400 border-slate-400'
                      }`}>
                        {puzzle.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400">{puzzle.features}</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-slate-300">{puzzle.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            puzzle.status === 'Complete' 
                              ? 'bg-gradient-to-r from-green-500 to-green-400'
                              : 'bg-gradient-to-r from-amber-500 to-amber-400'
                          }`}
                          style={{ width: `${puzzle.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-4 bg-slate-800/60 border border-slate-700 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-500">2/6</div>
                <div className="text-xs text-slate-400">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-500">33%</div>
                <div className="text-xs text-slate-400">Phase 2</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-500">527</div>
                <div className="text-xs text-slate-400">Lines Built</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-500">115kB</div>
                <div className="text-xs text-slate-400">Bundle Size</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-amber-100 mb-6">
            Phase 2 Major Milestone Achieved! 🎉
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            We've successfully built 2 out of 6 enhanced puzzles with sophisticated drag & drop interactions, 
            interactive cipher wheels, and multi-step progression systems. The advanced component architecture 
            is now ready for the remaining puzzle implementations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-amber-500 text-slate-900 hover:bg-amber-400 text-lg px-8 py-3">
              <Sparkles className="w-5 h-5 mr-2" />
              Experience Advanced Puzzles
            </Button>
            <Button size="lg" variant="outline" className="text-amber-400 border-amber-400 hover:bg-amber-400/10 text-lg px-8 py-3">
              Continue Building Phase 2
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
