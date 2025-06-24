"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Clock, Train, Search, CheckCircle, AlertCircle } from 'lucide-react'
import { PuzzleStep } from '@/lib/types/game'
import { validateAnswer } from '@/lib/utils/gameUtils'

interface TrainSchedulePuzzleProps {
  step: PuzzleStep
  onStepComplete: (answer: any, isCorrect: boolean) => void
  className?: string
}

// Step 1: Platform Identification Component
const PlatformIdentificationStep = ({ step, onStepComplete }: TrainSchedulePuzzleProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    const isCorrect = validateAnswer(selectedPlatform, step.validation)
    setSubmitted(true)
    onStepComplete(selectedPlatform, isCorrect)
  }

  const platformImages = [
    {
      id: "platform-1",
      name: "Platform 1 - Bogor Line",
      description: "Main platform with overhead digital displays",
      timeVisible: "19:30 Bogor - On Time",
      crowdLevel: "Heavy"
    },
    {
      id: "platform-2", 
      name: "Platform 2 - Bekasi Line",
      description: "Side platform with delayed train announcement",
      timeVisible: "19:45 Bekasi - Delayed 10 min",
      crowdLevel: "Light"
    },
    {
      id: "platform-3",
      name: "Platform 3 - Serpong Line", 
      description: "Underground platform with standard signage",
      timeVisible: "19:50 Serpong - On Time",
      crowdLevel: "Moderate"
    },
    {
      id: "platform-4",
      name: "Platform 4 - Tanah Abang Line",
      description: "Express platform with cancellation notice",
      timeVisible: "20:00 Tanah Abang - Cancelled",
      crowdLevel: "None"
    }
  ]

  return (
    <Card className="puzzle-container">
      <CardHeader>
        <CardTitle className="text-amber-100 flex items-center gap-2">
          <Train className="w-5 h-5" />
          {step.title}
        </CardTitle>
        <p className="text-slate-300">{step.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
            <h4 className="font-semibold text-amber-100 mb-3">CCTV Footage Analysis</h4>
            <p className="text-slate-300 text-sm mb-4">
              Based on the CCTV footage timestamp <span className="evidence-text">19:45</span>, 
              which platform was the victim approaching? Look carefully at the electronic departure 
              board visible in the background.
            </p>
          </div>

          <RadioGroup value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platformImages.map((platform) => (
                <div key={platform.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={platform.id} id={platform.id} />
                    <Label htmlFor={platform.id} className="text-amber-100">
                      {platform.name}
                    </Label>
                  </div>
                  <Card className={`cursor-pointer transition-all duration-200 ${
                    selectedPlatform === platform.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-600'
                  }`}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="aspect-video bg-slate-700 rounded border flex items-center justify-center">
                          <span className="text-slate-400 text-sm">Platform Image</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-300">{platform.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-400">{platform.timeVisible}</span>
                            <Badge variant="outline" className={`
                              ${platform.crowdLevel === 'Heavy' ? 'text-red-400 border-red-400' :
                                platform.crowdLevel === 'Moderate' ? 'text-yellow-400 border-yellow-400' :
                                platform.crowdLevel === 'Light' ? 'text-green-400 border-green-400' :
                                'text-slate-400 border-slate-400'}
                            `}>
                              {platform.crowdLevel} crowd
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-400">
              Select the platform based on the CCTV evidence
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedPlatform || submitted}
              className="bg-amber-500 text-slate-900 hover:bg-amber-400"
            >
              {submitted ? (
                <><CheckCircle className="w-4 h-4 mr-2" /> Submitted</>
              ) : (
                <>Submit Answer</>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Step 2: Schedule Analysis Component
const ScheduleAnalysisStep = ({ step, onStepComplete }: TrainSchedulePuzzleProps) => {
  const [calculatedTime, setCalculatedTime] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const scheduleData = [
    { time: "19:30", destination: "Bogor", platform: 1, status: "On Time", delay: 0 },
    { time: "19:45", destination: "Bekasi", platform: 2, status: "Delayed 10 min", delay: 10 },
    { time: "19:50", destination: "Serpong", platform: 3, status: "On Time", delay: 0 },
    { time: "20:00", destination: "Tanah Abang", platform: 4, status: "Cancelled", delay: 0 }
  ]

  const handleSubmit = () => {
    const numericAnswer = parseInt(calculatedTime)
    const isCorrect = validateAnswer(numericAnswer, step.validation)
    setSubmitted(true)
    onStepComplete(numericAnswer, isCorrect)
  }

  return (
    <Card className="puzzle-container">
      <CardHeader>
        <CardTitle className="text-amber-100 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {step.title}
        </CardTitle>
        <p className="text-slate-300">{step.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
            <h4 className="font-semibold text-amber-100 mb-3">Train Schedule Board</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-amber-100">Scheduled Time</TableHead>
                  <TableHead className="text-amber-100">Destination</TableHead>
                  <TableHead className="text-amber-100">Platform</TableHead>
                  <TableHead className="text-amber-100">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleData.map((train, index) => (
                  <TableRow key={index} className={train.platform === 2 ? 'bg-amber-500/10' : ''}>
                    <TableCell className="font-mono">{train.time}</TableCell>
                    <TableCell>{train.destination}</TableCell>
                    <TableCell>{train.platform}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        ${train.status.includes('Delayed') ? 'text-red-400 border-red-400' :
                          train.status === 'Cancelled' ? 'text-orange-400 border-orange-400' :
                          'text-green-400 border-green-400'}
                      `}>
                        {train.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-200 mb-2">Witness Statement</h4>
            <p className="text-blue-100 text-sm italic">
              "Pak Rahman saw the victim looking frustrated and checking his watch repeatedly 
              while waiting at Platform 2."
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-amber-100 mb-2">Calculate Waiting Time</h4>
              <p className="text-slate-300 text-sm mb-4">
                If the victim was seen at Platform 2 at 19:45, but the Bekasi train was delayed, 
                how many minutes would he have waited before the actual departure?
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-slate-300">Waiting time (minutes):</Label>
              <Input
                type="number"
                value={calculatedTime}
                onChange={(e) => setCalculatedTime(e.target.value)}
                placeholder="Enter minutes"
                className="w-32"
                min="0"
                max="60"
              />
              <Button 
                onClick={handleSubmit}
                disabled={!calculatedTime || submitted}
                className="bg-amber-500 text-slate-900 hover:bg-amber-400"
              >
                {submitted ? (
                  <><CheckCircle className="w-4 h-4 mr-2" /> Submitted</>
                ) : (
                  <>Calculate</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Step 3: Passenger Manifest Component
const PassengerManifestStep = ({ step, onStepComplete }: TrainSchedulePuzzleProps) => {
  const [selectedPassenger, setSelectedPassenger] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const passengerData = [
    { name: "Rahman Pratama", destination: "Bekasi", bookingRef: "BK19453", time: "19:55", seat: "A12" },
    { name: "Maya Kusuma", destination: "Bogor", bookingRef: "BG19201", time: "19:30", seat: "B03" },
    { name: "Budi Hermawan", destination: "Bekasi", bookingRef: "BK19454", time: "19:55", seat: "A13" },
    { name: "Agus Santoso", destination: "Serpong", bookingRef: "SP19385", time: "19:50", seat: "C07" },
    { name: "Sari Indraswari", destination: "Tanah Abang", bookingRef: "TA19102", time: "20:00", seat: "D01" },
    { name: "Indira Wulandari", destination: "Bekasi", bookingRef: "BK19401", time: "19:55", seat: "B15" }
  ]

  const filteredPassengers = passengerData.filter(passenger =>
    passenger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    passenger.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    passenger.bookingRef.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = () => {
    const isCorrect = validateAnswer(selectedPassenger, step.validation)
    setSubmitted(true)
    onStepComplete(selectedPassenger, isCorrect)
  }

  return (
    <Card className="puzzle-container">
      <CardHeader>
        <CardTitle className="text-amber-100 flex items-center gap-2">
          <Search className="w-5 h-5" />
          {step.title}
        </CardTitle>
        <p className="text-slate-300">{step.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
            <h4 className="font-semibold text-amber-100 mb-3">Investigation Question</h4>
            <p className="text-slate-300">
              Who else was booked on the same <span className="evidence-text">19:55 Bekasi train</span> as 
              the victim (Budi Hermawan)? Cross-reference the passenger manifest below.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-slate-300 mb-2 block">Search Passenger Database</Label>
              <Command className="border border-slate-600">
                <CommandInput 
                  placeholder="Search by name, destination, or booking reference..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList className="max-h-64">
                  <CommandEmpty>No passengers found.</CommandEmpty>
                  <CommandGroup>
                    {filteredPassengers.map((passenger, index) => (
                      <CommandItem
                        key={index}
                        value={passenger.name}
                        onSelect={() => setSelectedPassenger(passenger.name)}
                        className={`cursor-pointer ${selectedPassenger === passenger.name ? 'bg-amber-500/20' : ''}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className="font-medium">{passenger.name}</span>
                            <span className="text-sm text-slate-400">
                              {passenger.destination} • {passenger.time} • {passenger.bookingRef}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">Seat {passenger.seat}</div>
                            <Badge variant="outline" className={`
                              ${passenger.destination === 'Bekasi' && passenger.time === '19:55' ? 
                                'text-amber-400 border-amber-400' : 'text-slate-400 border-slate-400'}
                            `}>
                              {passenger.destination}
                            </Badge>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>

            {selectedPassenger && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-200 mb-2">Selected Passenger</h4>
                <p className="text-green-100">{selectedPassenger}</p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-400">
                Find the passenger traveling on the same route and time as the victim
              </div>
              <Button 
                onClick={handleSubmit}
                disabled={!selectedPassenger || submitted}
                className="bg-amber-500 text-slate-900 hover:bg-amber-400"
              >
                {submitted ? (
                  <><CheckCircle className="w-4 h-4 mr-2" /> Submitted</>
                ) : (
                  <>Submit Answer</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main puzzle component that renders the appropriate step
export const TrainSchedulePuzzle = ({ step, onStepComplete, className }: TrainSchedulePuzzleProps) => {
  switch (step.id) {
    case 'platform-identification':
      return <PlatformIdentificationStep step={step} onStepComplete={onStepComplete} />
    case 'schedule-analysis':
      return <ScheduleAnalysisStep step={step} onStepComplete={onStepComplete} />
    case 'passenger-manifest':
      return <PassengerManifestStep step={step} onStepComplete={onStepComplete} />
    default:
      return (
        <Card className="puzzle-container">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-amber-100 mb-2">Step Not Found</h3>
            <p className="text-slate-400">The requested puzzle step could not be loaded.</p>
          </CardContent>
        </Card>
      )
  }
} 