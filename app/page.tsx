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
  AlertTriangle
} from 'lucide-react'

// Sample clue for demonstration
const sampleClue = {
  id: "demo-clue",
  title: "Suspicious Train Delay",
  content: "The 19:45 Bekasi train was delayed by exactly 10 minutes, creating an unusual window of opportunity when Platform 2 was nearly empty of passengers.",
  category: "timeline" as const,
  revealCondition: {
    puzzleId: "train-schedule-investigation",
    stepId: "schedule-analysis"
  },
  importance: "critical" as const,
  relatedSuspects: ["rahman-security"],
  relatedEvidence: ["train-schedule-board"]
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="outline" className="text-amber-500 border-amber-500 mb-4">
              Interactive Murder Mystery
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-amber-100 mb-6 leading-tight">
              Murder Mystery at
              <span className="block text-amber-500">Stasiun Manggarai</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              A thrilling turn-based murder mystery game set in Jakarta&apos;s busiest railway station. 
              Work in teams to solve puzzles, gather clues, and unmask the killer before time runs out.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button size="lg" className="bg-amber-500 text-slate-900 hover:bg-amber-400 text-lg px-8 py-3">
              Start Investigation
            </Button>
            <Button size="lg" variant="outline" className="text-amber-400 border-amber-400 hover:bg-amber-400/10 text-lg px-8 py-3">
              How to Play
            </Button>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">7</div>
              <div className="text-slate-400">Teams</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">6</div>
              <div className="text-slate-400">Puzzles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">60</div>
              <div className="text-slate-400">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">1</div>
              <div className="text-slate-400">Killer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">Enhanced Investigation Experience</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Immerse yourself in a sophisticated mystery with multi-step puzzles, interactive components, and atmospheric design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-amber-100 flex items-center gap-3">
                  <Puzzle className="w-6 h-6 text-amber-500" />
                  Multi-Step Puzzles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Each puzzle features 3 progressive steps that build upon each other, 
                  from analyzing train schedules to decoding secret ciphers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-amber-100 flex items-center gap-3">
                  <Search className="w-6 h-6 text-amber-500" />
                  Interactive Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Drag-and-drop puzzles, cipher wheels, image enhancement tools, 
                  and 360° crime scene exploration for immersive gameplay.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-amber-100 flex items-center gap-3">
                  <Train className="w-6 h-6 text-amber-500" />
                  Railway Setting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Set in the authentic atmosphere of Stasiun Manggarai with 
                  Indonesian characters and realistic railway operations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Game Components Demo */}
      <section className="py-16 px-6 bg-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">Game Components</h2>
            <p className="text-slate-300 text-lg">Experience the investigation tools and interface</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Timer Demo */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-amber-100 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Game Timer
              </h3>
              <Timer showControls={true} className="max-w-md" />
              <p className="text-slate-400 text-sm">
                Track your investigation progress with real-time timing and pause controls for team coordination.
              </p>
            </div>

            {/* Clue Demo */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-amber-100 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Clue Discovery
              </h3>
              <ClueReveal clue={sampleClue} isRevealed={true} showAnimation={false} />
              <p className="text-slate-400 text-sm">
                Discover clues through puzzle completion with categorized evidence and suspect connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Flow */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">How the Investigation Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/20 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-amber-100 mb-2">Form Teams</h3>
              <p className="text-slate-300">
                Create teams of 4-5 investigators to collaborate on solving the mystery together.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/20 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Puzzle className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-amber-100 mb-2">Solve Puzzles</h3>
              <p className="text-slate-300">
                Work through 6 multi-step puzzles that reveal crucial clues about the murder case.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/20 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-amber-100 mb-2">Identify Killer</h3>
              <p className="text-slate-300">
                Use collected evidence and timeline analysis to make your final accusation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Suspects Preview */}
      <section className="py-16 px-6 bg-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">Meet the Suspects</h2>
            <p className="text-slate-300 text-lg">
              Seven railway station employees, each with their own secrets and motives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Sari Indraswari", role: "Station Master", suspicion: 7 },
              { name: "Rahman Pratama", role: "Security Chief", suspicion: 8 },
              { name: "Maya Kusuma", role: "Senior Ticket Clerk", suspicion: 4 },
              { name: "Agus Santoso", role: "Chief Maintenance", suspicion: 6 },
              { name: "Indira Wulandari", role: "Head of Cleaning", suspicion: 5 },
              { name: "Bayu Nugroho", role: "Public Announcer", suspicion: 6 }
            ].map((suspect, index) => (
              <Card key={index} className="suspect-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-amber-100">{suspect.name}</h3>
                      <p className="text-sm text-slate-400">{suspect.role}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-orange-400">{suspect.suspicion}/10</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Investigate their alibi, motives, and connections to uncover the truth.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-amber-100 mb-6">
            Ready to Solve the Mystery?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Gather your team and dive into the most immersive murder mystery experience. 
            Every clue matters, every suspect has secrets, and time is running out.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-amber-500 text-slate-900 hover:bg-amber-400 text-lg px-8 py-3">
              Begin Investigation
            </Button>
            <Button size="lg" variant="outline" className="text-amber-400 border-amber-400 hover:bg-amber-400/10 text-lg px-8 py-3">
              Admin Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
