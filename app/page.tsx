import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

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
  Play,
  Shield,
  Target,
  Brain,
  Timer,
  Award,
  UserCheck
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="outline" className="text-amber-500 border-amber-500 mb-4">
              🚆 Interactive Murder Mystery Experience
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-amber-100 mb-6 leading-tight">
              Murder Mystery at
              <span className="block text-amber-500">Stasiun Manggarai</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              A body has been discovered at Jakarta's busiest railway station. As a team of investigators, 
              you must solve <strong className="text-amber-400">6 interactive puzzles</strong>, uncover clues, 
              and identify the killer before time runs out.
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Experience advanced puzzle interactions, real-time team collaboration, 
              and a gripping Indonesian railway murder mystery.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href="/game/register">
              <Button size="lg" className="bg-amber-500 text-slate-900 hover:bg-amber-400 text-lg px-8 py-3">
                <Play className="w-5 h-5 mr-2" />
                Start Investigation
              </Button>
            </Link>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">6</div>
              <div className="text-slate-400">Interactive Puzzles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">12</div>
              <div className="text-slate-400">Clues to Discover</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">7</div>
              <div className="text-slate-400">Suspects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">60</div>
              <div className="text-slate-400">Minutes to Solve</div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">Investigation Experience</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Immerse yourself in a professionally crafted murder mystery with advanced puzzle mechanics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-amber-100 flex items-center gap-3">
                  <Brain className="w-6 h-6 text-amber-500" />
                  Interactive Puzzles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Drag & drop evidence assembly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Interactive cipher wheels</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Canvas-based image analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Timeline reconstruction</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-amber-100 flex items-center gap-3">
                  <Users className="w-6 h-6 text-amber-500" />
                  Team Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Real-time team progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Shared clue discovery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Multi-device support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Performance tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-amber-100 flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-500" />
                  Immersive Story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Indonesian railway setting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Complex character backgrounds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Progressive clue revelation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Multiple solution paths</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Puzzle Showcase */}
      <section className="py-16 px-6 bg-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">Six Challenging Investigations</h2>
            <p className="text-slate-300 text-lg">Each puzzle reveals crucial evidence about the murder at Stasiun Manggarai</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                name: "Train Schedule Investigation", 
                icon: Train, 
                description: "Analyze CCTV footage and passenger manifests to track the victim's final journey",
                difficulty: "Beginner"
              },
              { 
                name: "Lost Luggage Cipher", 
                icon: Puzzle, 
                description: "Reconstruct fragmented luggage tags and decode hidden messages",
                difficulty: "Intermediate"
              },
              { 
                name: "Station Environment Riddle", 
                icon: MapPin, 
                description: "Navigate the crime scene and discover evidence in a 360° investigation",
                difficulty: "Intermediate"
              },
              { 
                name: "Witness Statement Analysis", 
                icon: UserCheck, 
                description: "Cross-reference testimonies and build an accurate timeline of events",
                difficulty: "Advanced"
              },
              { 
                name: "CCTV Image Analysis", 
                icon: Eye, 
                description: "Enhance security footage to identify crucial evidence and suspects",
                difficulty: "Advanced"
              },
              { 
                name: "Mathematical Schedule Analysis", 
                icon: Target, 
                description: "Calculate timing discrepancies and staff access patterns",
                difficulty: "Expert"
              }
            ].map((puzzle, index) => (
              <Card key={index} className="bg-slate-800/60 border-slate-700 hover:border-amber-500/30 transition-colors">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <puzzle.icon className="w-8 h-8 text-amber-500" />
                      <Badge variant="outline" className={`text-xs ${
                        puzzle.difficulty === 'Beginner' ? 'text-green-400 border-green-400' :
                        puzzle.difficulty === 'Intermediate' ? 'text-yellow-400 border-yellow-400' :
                        puzzle.difficulty === 'Advanced' ? 'text-orange-400 border-orange-400' :
                        'text-red-400 border-red-400'
                      }`}>
                        {puzzle.difficulty}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-100 mb-2">{puzzle.name}</h3>
                      <p className="text-sm text-slate-300">{puzzle.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Game Flow */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">How to Play</h2>
            <p className="text-slate-300 text-lg">Your path to solving the murder mystery</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-amber-500 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-xl font-semibold text-amber-100">Form Your Team</h3>
              <p className="text-slate-300 text-sm">Register your investigation team (1-5 members) and start your case</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-amber-500 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-xl font-semibold text-amber-100">Investigate</h3>
              <p className="text-slate-300 text-sm">Solve 6 interactive puzzles to uncover clues and evidence</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-amber-500 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-xl font-semibold text-amber-100">Analyze</h3>
              <p className="text-slate-300 text-sm">Connect the evidence and narrow down your list of suspects</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-amber-500 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-xl font-semibold text-amber-100">Solve</h3>
              <p className="text-slate-300 text-sm">Make your final accusation and see if you caught the killer</p>
            </div>
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
            A murder has taken place at Jakarta's busiest railway station. 
            The evidence is waiting, the suspects are hiding their secrets, 
            and time is running out. Do you have what it takes to solve the case?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/game/register">
              <Button size="lg" className="bg-amber-500 text-slate-900 hover:bg-amber-400 text-lg px-8 py-3">
                <Play className="w-5 h-5 mr-2" />
                Begin Investigation
              </Button>
            </Link>
          </div>

          <div className="mt-12 inline-flex items-center gap-6 bg-slate-800/60 border border-slate-700 rounded-lg p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500 flex items-center gap-2">
                <Timer className="w-6 h-6" />
                60 min
              </div>
              <div className="text-xs text-slate-400">Average completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                4.8/5
              </div>
              <div className="text-xs text-slate-400">Difficulty rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500 flex items-center gap-2">
                <Target className="w-6 h-6" />
                85%
              </div>
              <div className="text-xs text-slate-400">Success rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
