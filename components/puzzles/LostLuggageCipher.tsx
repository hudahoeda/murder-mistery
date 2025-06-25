"use client"

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { motion } from 'motion/react'
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
import Image from 'next/image'

interface LostLuggageCipherProps {
  step: PuzzleStep
  onStepComplete: (answer: any, isCorrect: boolean) => void
  className?: string
}

interface PuzzlePiece {
  id: string
  content: string
  position: number
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
  // Function to shuffle array randomly
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const defaultPieces = useMemo(() => [
    { id: 'piece-1', content: 'LUG', position: 0 },
    { id: 'piece-2', content: 'GE-', position: 1 },
    { id: 'piece-3', content: '457', position: 2 },
    { id: 'piece-4', content: 'BEK', position: 3 },
    { id: 'piece-5', content: 'ASI', position: 4 }
  ], [])
  
  // Initialize pieces in random order to prevent giving away the answer
  const [pieces, setPieces] = useState<PuzzlePiece[]>(() => {
    if (step.content?.pieces) {
      return shuffleArray(step.content.pieces.map((piece: any, index: number) => ({
        id: piece.id || `piece-${index + 1}`,
        content: piece.content || '',
        position: index
      })))
    }
    return shuffleArray(defaultPieces)
  })
  const [submitted, setSubmitted] = useState(false)
  
  useEffect(() => {
    setSubmitted(false);
    // Re-shuffle pieces when the step changes to ensure a fresh start
    if (step.content?.pieces) {
      setPieces(
        shuffleArray(
          step.content.pieces.map((piece: any, index: number) => ({
            id: piece.id || `piece-${index + 1}`,
            content: piece.content || '',
            position: index,
          })),
        ),
      );
    } else {
      setPieces(shuffleArray(defaultPieces));
    }
  }, [step, defaultPieces]);

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
                {step.content?.targetImage ? (
                  <div className="aspect-[3/2] bg-slate-700 rounded border-2 border-dashed border-slate-500 flex items-center justify-center p-4 relative">
                    <Image
                      src={step.content.targetImage}
                      alt="Luggage tag template"
                      layout="fill"
                      objectFit="contain"
                      className="absolute inset-0 w-full h-full object-contain opacity-20"
                      onError={e =>
                        console.error(
                          '❌ Luggage template failed:',
                          step.content?.targetImage,
                          e,
                        )
                      }
                    />
                    <div className="text-center relative z-10">
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
                ) : (
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
                )}
                
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
  const [shift, setShift] = useState(0);
  const [manualDecoded, setManualDecoded] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setShift(0);
    setManualDecoded('');
    setSubmitted(false);
  }, [step]);

  const encryptedText = step.content?.encryptedText || 'CUUJ QJ IJEHQWU HEEC';

  const handleSubmit = () => {
    const isCorrect = validateAnswer(manualDecoded, step.validation);
    setSubmitted(true);
    onStepComplete(manualDecoded, isCorrect);
  };

  const wheelRotation = (shift * 360) / 26

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numLetters = alphabet.length;
  const angleStep = 360 / numLetters;

  // Dimensions
  const size = 320;
  const center = size / 2;
  const outerRadius = 150;
  const midRadius = 110;
  const innerRadius = 70;
  const outerTextRadius = 130;
  const innerTextRadius = 90;

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
              <strong>Hint:</strong> The shift value can be found by adding the three numbers from the luggage tag
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cipher wheel */}
            <div>
              <h4 className="font-semibold text-amber-100 mb-3">Caesar Cipher Wheel</h4>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative" style={{ width: size, height: size }}>
                  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute">
                    <defs>
                      <linearGradient id="outer-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                      <linearGradient id="inner-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#1e293b" />
                      </linearGradient>
                    </defs>

                    {/* Rings */}
                    <circle cx={center} cy={center} r={outerRadius} fill="url(#outer-grad)" />
                    <circle cx={center} cy={center} r={midRadius} fill="url(#inner-grad)" />
                    <circle cx={center} cy={center} r={innerRadius} fill="#0f172a" />

                    {/* Ticks */}
                    {Array.from({ length: numLetters }).map((_, i) => {
                        const angle = i * angleStep;
                        const startX = center + midRadius * Math.cos((angle - 90) * Math.PI / 180);
                        const startY = center + midRadius * Math.sin((angle - 90) * Math.PI / 180);
                        const endX = center + outerRadius * Math.cos((angle - 90) * Math.PI / 180);
                        const endY = center + outerRadius * Math.sin((angle - 90) * Math.PI / 180);
                        return <line key={`tick-${i}`} x1={startX} y1={startY} x2={endX} y2={endY} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />;
                    })}
                    {Array.from({ length: numLetters }).map((_, i) => {
                        const angle = i * angleStep;
                        const startX = center + innerRadius * Math.cos((angle - 90) * Math.PI / 180);
                        const startY = center + innerRadius * Math.sin((angle - 90) * Math.PI / 180);
                        const endX = center + midRadius * Math.cos((angle - 90) * Math.PI / 180);
                        const endY = center + midRadius * Math.sin((angle - 90) * Math.PI / 180);
                        return <line key={`tick-inner-${i}`} x1={startX} y1={startY} x2={endX} y2={endY} stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />;
                    })}

                    {/* Inner Text (Plain) */}
                    <g>
                      {alphabet.split('').map((char, i) => {
                        const angle = i * angleStep;
                        const x = center + innerTextRadius * Math.cos((angle - 90) * Math.PI / 180);
                        const y = center + innerTextRadius * Math.sin((angle - 90) * Math.PI / 180);
                        return (
                          <text
                            key={`inner-${i}`}
                            x={x}
                            y={y}
                            dy="0.35em"
                            textAnchor="middle"
                            fill="#cbd5e1"
                            fontSize="16"
                            fontWeight="bold"
                            transform={`rotate(${angle}, ${x}, ${y})`}
                          >
                            {char}
                          </text>
                        );
                      })}
                    </g>
                    
                    {/* Outer Text (Cipher) */}
                    <motion.g
                      animate={{ rotate: wheelRotation }}
                      transition={{ type: 'spring', duration: 0.7, bounce: 0.25 }}
                      style={{ transformOrigin: `${center}px ${center}px` }}
                    >
                      {alphabet.split('').map((char, i) => {
                        const angle = i * angleStep;
                        const x = center + outerTextRadius * Math.cos((angle - 90) * Math.PI / 180);
                        const y = center + outerTextRadius * Math.sin((angle - 90) * Math.PI / 180);
                        return (
                          <text
                            key={`outer-${i}`}
                            x={x}
                            y={y}
                            dy="0.35em"
                            textAnchor="middle"
                            fill="white"
                            fontSize="20"
                            fontWeight="bold"
                            transform={`rotate(${angle}, ${x}, ${y})`}
                          >
                            {char}
                          </text>
                        );
                      })}
                    </motion.g>
                  </svg>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center w-24">
                      <Label htmlFor="shift-input" className="text-slate-300 text-xs mb-1">Enter Key:</Label>
                      <Input
                        id="shift-input"
                        type="number"
                        value={shift}
                        onChange={(e) => setShift(parseInt(e.target.value) || 0)}
                        min="0"
                        max="25"
                        className="w-20 text-center bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
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
                  
                  <Label className="text-slate-300 mb-2 block">Enter Decoded Message:</Label>
                  <Input
                    type="text"
                    value={manualDecoded}
                    onChange={e => setManualDecoded(e.target.value.toUpperCase())}
                    placeholder="Use the cipher wheel to decode manually..."
                    className="font-mono text-lg bg-slate-900"
                  />
                </div>

                {manualDecoded === 'MEET AT STORAGE ROOM' && (
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
              disabled={manualDecoded !== 'MEET AT STORAGE ROOM' || submitted}
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
  
  useEffect(() => {
    setAccessCode('')
    setSubmitted(false)
  }, [step])

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
                <li>• Access codes use 24-hour time format (HHMM)</li>
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