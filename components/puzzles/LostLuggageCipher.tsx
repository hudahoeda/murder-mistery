"use client"

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import {
  CSS
} from '@dnd-kit/utilities'
import { Puzzle, RotateCcw, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { PuzzleStep } from '@/lib/types/game'
import { validateAnswer } from '@/lib/utils/gameUtils'

interface LostLuggageCipherProps {
  step: PuzzleStep
  onStepComplete: (answer: any, isCorrect: boolean) => void
  className?: string
}

// Draggable piece component for luggage tag assembly
interface SortableItemProps {
  id: string
  content: string
  isPlaced: boolean
}

const SortableItem = ({ id, content, isPlaced }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        p-3 m-1 border-2 rounded-lg cursor-grab active:cursor-grabbing
        text-center font-mono text-lg font-bold
        ${isPlaced 
          ? 'bg-green-500/20 border-green-500 text-green-200' 
          : 'bg-slate-700 border-slate-500 text-slate-200'
        }
        ${isDragging ? 'shadow-lg z-10' : ''}
        hover:border-amber-400 transition-colors
      `}
    >
      {content}
    </div>
  )
}

// Step 1: Luggage Tag Assembly
const LuggageTagAssemblyStep = ({ step, onStepComplete }: LostLuggageCipherProps) => {
  const [pieces, setPieces] = useState([
    { id: 'piece-1', content: 'LUG', position: 0 },
    { id: 'piece-2', content: 'GE-', position: 1 },
    { id: 'piece-3', content: '457', position: 2 },
    { id: 'piece-4', content: 'BEK', position: 3 },
    { id: 'piece-5', content: 'ASI', position: 4 }
  ])
  const [submitted, setSubmitted] = useState(false)
  
  const correctOrder = ['LUG', 'GE-', '457', 'BEK', 'ASI']
  const isCorrectOrder = pieces.map(p => p.content).join('') === correctOrder.join('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setPieces((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)
        
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }, [])

  const handleSubmit = () => {
    const reconstructedTag = pieces.map(p => p.content).join('')
    const isCorrect = reconstructedTag === 'LUGGE-457BEKASI'
    setSubmitted(true)
    onStepComplete(reconstructedTag, isCorrect)
  }

  return (
    <Card className="puzzle-container">
      <CardHeader>
        <CardTitle className="text-amber-100 flex items-center gap-2">
          <Puzzle className="w-5 h-5" />
          {step.title}
        </CardTitle>
        <p className="text-slate-300">{step.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
            <h4 className="font-semibold text-amber-100 mb-3">Evidence Found</h4>
            <p className="text-slate-300 text-sm mb-4">
              Torn luggage tag pieces were discovered near the crime scene. 
              Drag and arrange the pieces to reconstruct the original tag and reveal its information.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Puzzle pieces area */}
            <div>
              <h4 className="font-semibold text-amber-100 mb-3">Torn Pieces</h4>
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 min-h-[200px]">
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={pieces.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {pieces.map((piece) => (
                        <SortableItem
                          key={piece.id}
                          id={piece.id}
                          content={piece.content}
                          isPlaced={false}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </div>

            {/* Reconstructed tag preview */}
            <div>
              <h4 className="font-semibold text-amber-100 mb-3">Reconstructed Tag</h4>
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                <div className="aspect-[3/2] bg-slate-700 rounded border-2 border-dashed border-slate-500 flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="font-mono text-2xl font-bold text-amber-200 mb-2">
                      {pieces.map(p => p.content).join('')}
                    </div>
                    {isCorrectOrder && (
                      <Badge className="bg-green-500/20 text-green-200 border-green-500">
                        ✓ Correctly Assembled
                      </Badge>
                    )}
                  </div>
                </div>
                
                {isCorrectOrder && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded">
                    <h5 className="font-semibold text-green-200 mb-1">Tag Information</h5>
                    <p className="text-green-100 text-sm">
                      Luggage Number: <span className="font-mono">457</span><br />
                      Destination: <span className="font-mono">BEKASI</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-400">
              Drag pieces to arrange them in the correct order
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={!isCorrectOrder || submitted}
              className="bg-amber-500 text-slate-900 hover:bg-amber-400"
            >
              {submitted ? (
                <><CheckCircle className="w-4 h-4 mr-2" /> Submitted</>
              ) : (
                <>Confirm Assembly</>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Step 2: Caesar Cipher Decoding
const CaesarCipherStep = ({ step, onStepComplete }: LostLuggageCipherProps) => {
  const [shift, setShift] = useState(0)
  const [decodedText, setDecodedText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  
  const encryptedText = "PHHW DW VWRUH URRP"
  
  const decodeCaesar = (text: string, shiftAmount: number) => {
    return text.split('').map(char => {
      if (char.match(/[A-Z]/)) {
        const code = char.charCodeAt(0) - 65
        const shifted = (code - shiftAmount + 26) % 26
        return String.fromCharCode(shifted + 65)
      }
      return char
    }).join('')
  }

  const handleShiftChange = (newShift: number) => {
    setShift(newShift)
    setDecodedText(decodeCaesar(encryptedText, newShift))
  }

  const handleSubmit = () => {
    const isCorrect = validateAnswer(decodedText, step.validation)
    setSubmitted(true)
    onStepComplete(decodedText, isCorrect)
  }

  const wheelRotation = (shift * 360) / 26

  return (
    <Card className="puzzle-container">
      <CardHeader>
        <CardTitle className="text-amber-100 flex items-center gap-2">
          <RotateCcw className="w-5 h-5" />
          {step.title}
        </CardTitle>
        <p className="text-slate-300">{step.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
            <h4 className="font-semibold text-amber-100 mb-3">Hidden Message Found</h4>
            <p className="text-slate-300 text-sm mb-2">
              A secret message was discovered on the back of the reconstructed luggage tag:
            </p>
            <div className="font-mono text-lg text-amber-200 bg-slate-800 p-3 rounded border">
              {encryptedText}
            </div>
            <p className="text-slate-400 text-sm mt-2">
              <strong>Hint:</strong> The shift value is the same as the luggage number's last digit (7)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cipher wheel */}
            <div>
              <h4 className="font-semibold text-amber-100 mb-3">Caesar Cipher Wheel</h4>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-64 h-64">
                  {/* Outer ring (encrypted) */}
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-amber-500 bg-slate-700 flex items-center justify-center text-xs font-mono"
                    style={{ transform: `rotate(${wheelRotation}deg)` }}
                  >
                    <div className="absolute inset-4 rounded-full border-2 border-slate-500 bg-slate-800">
                      {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter, index) => {
                        const angle = (index * 360) / 26 - 90
                        const x = Math.cos(angle * Math.PI / 180) * 90
                        const y = Math.sin(angle * Math.PI / 180) * 90
                        return (
                          <span
                            key={letter}
                            className="absolute text-amber-200 font-bold"
                            style={{
                              left: `calc(50% + ${x}px)`,
                              top: `calc(50% + ${y}px)`,
                              transform: `translate(-50%, -50%) rotate(${-wheelRotation}deg)`
                            }}
                          >
                            {letter}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Inner ring (decoded) */}
                  <div className="absolute inset-8 rounded-full border-2 border-slate-400 bg-slate-900 flex items-center justify-center">
                    {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter, index) => {
                      const angle = (index * 360) / 26 - 90
                      const x = Math.cos(angle * Math.PI / 180) * 60
                      const y = Math.sin(angle * Math.PI / 180) * 60
                      return (
                        <span
                          key={letter}
                          className="absolute text-slate-300 text-sm"
                          style={{
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          {letter}
                        </span>
                      )
                    })}
                  </div>
                  
                  {/* Center indicator */}
                  <div className="absolute inset-1/2 w-2 h-2 bg-amber-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="flex items-center space-x-4">
                  <Label className="text-slate-300">Shift:</Label>
                  <Input
                    type="number"
                    value={shift}
                    onChange={(e) => handleShiftChange(parseInt(e.target.value) || 0)}
                    min="0"
                    max="25"
                    className="w-20"
                  />
                  <Button
                    onClick={() => handleShiftChange(7)}
                    variant="outline"
                    size="sm"
                  >
                    Try 7
                  </Button>
                </div>
              </div>
            </div>

            {/* Decoded message */}
            <div>
              <h4 className="font-semibold text-amber-100 mb-3">Decoded Message</h4>
              <div className="space-y-4">
                <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                  <Label className="text-slate-300 mb-2 block">Encrypted:</Label>
                  <div className="font-mono text-red-300 mb-4">{encryptedText}</div>
                  
                  <Label className="text-slate-300 mb-2 block">Decoded:</Label>
                  <div className="font-mono text-lg text-green-300 bg-slate-900 p-3 rounded border">
                    {decodedText || "Adjust the shift value to decode..."}
                  </div>
                </div>

                {decodedText === "MEET AT STORE ROOM" && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                    <h5 className="font-semibold text-green-200 mb-1">✓ Message Decoded!</h5>
                    <p className="text-green-100 text-sm">
                      The secret message has been revealed. This appears to be instructions for a clandestine meeting.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-400">
              Use the cipher wheel to decode the secret message
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={decodedText !== "MEET AT STORE ROOM" || submitted}
              className="bg-amber-500 text-slate-900 hover:bg-amber-400"
            >
              {submitted ? (
                <><CheckCircle className="w-4 h-4 mr-2" /> Submitted</>
              ) : (
                <>Confirm Decoding</>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Step 3: Evidence Locker Access
const EvidenceLockerStep = ({ step, onStepComplete }: LostLuggageCipherProps) => {
  const [accessCode, setAccessCode] = useState('')
  const [submitted, setSubmitted] = useState(false)
  
  const handleSubmit = () => {
    const isCorrect = validateAnswer(accessCode, step.validation)
    setSubmitted(true)
    onStepComplete(accessCode, isCorrect)
  }

  const isCorrectCode = accessCode === "2015"

  return (
    <Card className="puzzle-container">
      <CardHeader>
        <CardTitle className="text-amber-100 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          {step.title}
        </CardTitle>
        <p className="text-slate-300">{step.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
            <h4 className="font-semibold text-amber-100 mb-3">Storage Room Access</h4>
            <p className="text-slate-300 text-sm mb-4">
              The decoded message mentions a "store room". Based on the station security protocols, 
              storage rooms use a time-based access code system in HHMM format.
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
              <h5 className="font-semibold text-blue-200 mb-2">Additional Evidence:</h5>
              <ul className="text-blue-100 text-sm space-y-1">
                <li>• The meeting was arranged for "quarter past eight in the evening"</li>
                <li>• Military time format is used for all station security systems</li>
                <li>• Time found in other evidence: 20:15</li>
              </ul>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-slate-800 border-2 border-slate-600 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-amber-500" />
                </div>
                <h4 className="font-semibold text-amber-100">Security Access Panel</h4>
                <p className="text-slate-400 text-sm">Enter 4-digit time code (HHMM)</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300 mb-2 block">Access Code:</Label>
                  <Input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="HHMM"
                    maxLength={4}
                    className="text-center text-lg font-mono tracking-widest"
                  />
                </div>

                {isCorrectCode && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-center">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-green-200 font-semibold">ACCESS GRANTED</p>
                    <p className="text-green-100 text-sm">Storage room unlocked successfully</p>
                  </div>
                )}

                <div className="text-center">
                  <Button 
                    onClick={handleSubmit}
                    disabled={accessCode.length !== 4 || submitted}
                    className="bg-amber-500 text-slate-900 hover:bg-amber-400 w-full"
                  >
                    {submitted ? (
                      <><CheckCircle className="w-4 h-4 mr-2" /> Submitted</>
                    ) : (
                      <>Enter Access Code</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/20 border border-slate-600 rounded p-3">
            <h5 className="font-semibold text-slate-300 mb-2">Hint:</h5>
            <p className="text-slate-400 text-sm">
              "Quarter past eight in the evening" in 24-hour military time format would be...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main puzzle component
export const LostLuggageCipher = ({ step, onStepComplete, className }: LostLuggageCipherProps) => {
  switch (step.id) {
    case 'luggage-tag-assembly':
      return <LuggageTagAssemblyStep step={step} onStepComplete={onStepComplete} />
    case 'caesar-cipher-decoding':
      return <CaesarCipherStep step={step} onStepComplete={onStepComplete} />
    case 'evidence-locker-access':
      return <EvidenceLockerStep step={step} onStepComplete={onStepComplete} />
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