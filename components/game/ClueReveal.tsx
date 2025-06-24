"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, AlertCircle, Search, MapPin, Clock, User } from 'lucide-react'
import { Clue } from '@/lib/types/game'
import { cn } from '@/lib/utils/gameUtils'

interface ClueRevealProps {
  clue: Clue
  isRevealed?: boolean
  showAnimation?: boolean
  onReveal?: () => void
  className?: string
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'suspect':
      return <User className="w-4 h-4" />
    case 'evidence':
      return <Search className="w-4 h-4" />
    case 'timeline':
      return <Clock className="w-4 h-4" />
    case 'location':
      return <MapPin className="w-4 h-4" />
    case 'method':
      return <AlertCircle className="w-4 h-4" />
    default:
      return <Eye className="w-4 h-4" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'suspect':
      return 'text-red-400 border-red-400'
    case 'evidence':
      return 'text-blue-400 border-blue-400'
    case 'timeline':
      return 'text-green-400 border-green-400'
    case 'location':
      return 'text-purple-400 border-purple-400'
    case 'method':
      return 'text-orange-400 border-orange-400'
    default:
      return 'text-amber-400 border-amber-400'
  }
}

const getImportanceStyle = (importance: string) => {
  switch (importance) {
    case 'critical':
      return 'border-red-500/50 bg-red-500/5'
    case 'important':
      return 'border-amber-500/50 bg-amber-500/5'
    case 'helpful':
      return 'border-blue-500/50 bg-blue-500/5'
    case 'background':
      return 'border-slate-500/50 bg-slate-500/5'
    default:
      return 'border-slate-600/50 bg-slate-600/5'
  }
}

export const ClueReveal = ({ 
  clue, 
  isRevealed = false, 
  showAnimation = true,
  onReveal,
  className 
}: ClueRevealProps) => {
  const [isVisible, setIsVisible] = useState(isRevealed)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isRevealed && !isVisible && showAnimation) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsVisible(true)
        setIsAnimating(false)
        if (onReveal) {
          onReveal()
        }
      }, 500)
      return () => clearTimeout(timer)
    } else if (isRevealed) {
      setIsVisible(true)
    }
  }, [isRevealed, isVisible, showAnimation, onReveal])

  if (!isVisible && !isAnimating) {
    return (
      <Card className={cn("bg-slate-800/20 border-slate-700/50", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <EyeOff className="w-5 h-5" />
            <span className="text-sm">Clue not yet discovered</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(
      "transition-all duration-700 ease-out",
      getImportanceStyle(clue.importance),
      isAnimating && "animate-pulse opacity-0",
      isVisible && !isAnimating && "clue-reveal opacity-100",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-amber-100 flex items-center gap-2">
            {getCategoryIcon(clue.category)}
            {clue.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn("text-xs", getCategoryColor(clue.category))}
            >
              {clue.category}
            </Badge>
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                clue.importance === 'critical' ? 'text-red-400 border-red-400' :
                clue.importance === 'important' ? 'text-amber-400 border-amber-400' :
                clue.importance === 'helpful' ? 'text-blue-400 border-blue-400' :
                'text-slate-400 border-slate-400'
              )}
            >
              {clue.importance}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <p className="text-slate-200 leading-relaxed">
            {clue.content}
          </p>

          {/* Related Information */}
          {(clue.relatedSuspects?.length || clue.relatedEvidence?.length) && (
            <div className="pt-3 border-t border-slate-600/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {clue.relatedSuspects && clue.relatedSuspects.length > 0 && (
                  <div>
                    <h4 className="text-slate-300 font-medium mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Related Suspects
                    </h4>
                    <div className="space-y-1">
                      {clue.relatedSuspects.map((suspectId, index) => (
                        <div key={index} className="evidence-text">
                          {suspectId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {clue.relatedEvidence && clue.relatedEvidence.length > 0 && (
                  <div>
                    <h4 className="text-slate-300 font-medium mb-2 flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Related Evidence
                    </h4>
                    <div className="space-y-1">
                      {clue.relatedEvidence.map((evidenceId, index) => (
                        <div key={index} className="evidence-text">
                          {evidenceId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clue Source Information */}
          <div className="pt-3 border-t border-slate-600/50">
            <div className="text-xs text-slate-400">
              <strong>Discovered from:</strong> {clue.revealCondition.puzzleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              {clue.revealCondition.stepId && (
                <span> - {clue.revealCondition.stepId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ClueListProps {
  clues: Clue[]
  revealedClueIds: string[]
  className?: string
}

export const ClueList = ({ clues, revealedClueIds, className }: ClueListProps) => {
  const [expandedClues, setExpandedClues] = useState<Set<string>>(new Set())

  const toggleClue = (clueId: string) => {
    setExpandedClues(prev => {
      const newSet = new Set(prev)
      if (newSet.has(clueId)) {
        newSet.delete(clueId)
      } else {
        newSet.add(clueId)
      }
      return newSet
    })
  }

  const revealedClues = clues.filter(clue => revealedClueIds.includes(clue.id))
  const criticalClues = revealedClues.filter(clue => clue.importance === 'critical')
  const importantClues = revealedClues.filter(clue => clue.importance === 'important')
  const otherClues = revealedClues.filter(clue => !['critical', 'important'].includes(clue.importance))

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-amber-100">Investigation Clues</h2>
        <Badge variant="outline" className="text-amber-400 border-amber-400">
          {revealedClues.length} / {clues.length} discovered
        </Badge>
      </div>

      {criticalClues.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Critical Evidence
          </h3>
          <div className="space-y-4">
            {criticalClues.map(clue => (
              <ClueReveal key={clue.id} clue={clue} isRevealed={true} showAnimation={false} />
            ))}
          </div>
        </div>
      )}

      {importantClues.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Important Clues
          </h3>
          <div className="space-y-4">
            {importantClues.map(clue => (
              <ClueReveal key={clue.id} clue={clue} isRevealed={true} showAnimation={false} />
            ))}
          </div>
        </div>
      )}

      {otherClues.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Additional Information
          </h3>
          <div className="space-y-4">
            {otherClues.map(clue => (
              <ClueReveal key={clue.id} clue={clue} isRevealed={true} showAnimation={false} />
            ))}
          </div>
        </div>
      )}

      {revealedClues.length === 0 && (
        <Card className="bg-slate-800/20 border-slate-700/50">
          <CardContent className="p-8 text-center">
            <EyeOff className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No Clues Discovered Yet</h3>
            <p className="text-slate-500">
              Complete puzzle steps to reveal clues and evidence that will help solve the mystery.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 