"use client"

import React, { useState, useEffect } from 'react'
import { Clock, Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/gameUtils'

interface TimerProps {
  startTime?: Date
  isRunning?: boolean
  onTimeUpdate?: (elapsedMinutes: number) => void
  showControls?: boolean
  className?: string
}

export const Timer = ({ 
  startTime = new Date(),
  isRunning = true,
  onTimeUpdate,
  showControls = false,
  className 
}: TimerProps) => {
  const [elapsedTime, setElapsedTime] = useState(0) // in seconds
  const [isPaused, setIsPaused] = useState(!isRunning)
  const [lastStartTime, setLastStartTime] = useState<Date>(startTime)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (!isPaused) {
      interval = setInterval(() => {
        const now = new Date()
        const elapsed = Math.floor((now.getTime() - lastStartTime.getTime()) / 1000)
        setElapsedTime(elapsed)
        
        // Call onTimeUpdate with minutes
        if (onTimeUpdate) {
          onTimeUpdate(Math.floor(elapsed / 60))
        }
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isPaused, lastStartTime, onTimeUpdate])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimeColor = (seconds: number): string => {
    const minutes = seconds / 60
    if (minutes < 30) return 'text-green-400'
    if (minutes < 45) return 'text-yellow-400'
    if (minutes < 60) return 'text-orange-400'
    return 'text-red-400'
  }

  const handlePlayPause = () => {
    if (isPaused) {
      setLastStartTime(new Date(Date.now() - elapsedTime * 1000))
      setIsPaused(false)
    } else {
      setIsPaused(true)
    }
  }

  const handleReset = () => {
    setElapsedTime(0)
    setLastStartTime(new Date())
    setIsPaused(false)
  }

  return (
    <Card className={cn("bg-slate-800/60 border-slate-700", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-500" />
            <div className="text-2xl font-mono font-bold">
              <span className={getTimeColor(elapsedTime)}>
                {formatTime(elapsedTime)}
              </span>
            </div>
            {isPaused && (
              <div className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
                PAUSED
              </div>
            )}
          </div>

          {showControls && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPause}
                className="text-amber-400 border-amber-400 hover:bg-amber-400/10"
              >
                {isPaused ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-slate-400 border-slate-600 hover:bg-slate-600/10"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="mt-2 text-xs text-slate-400">
          {isPaused ? 'Timer paused' : 'Game in progress'}
        </div>
      </CardContent>
    </Card>
  )
} 