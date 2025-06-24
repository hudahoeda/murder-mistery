'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Eye, RotateCcw, ZoomIn } from 'lucide-react';
import { PuzzleStep } from '@/lib/types/game';

interface StationEnvironmentRiddleProps {
  step: PuzzleStep;
  onStepComplete: (answer: any, isCorrect: boolean) => void;
  className?: string;
}

const depotAreas = [
  { id: 'depot-a', coordinates: [120, 180], label: 'Depot A', description: 'Morning Shift (06:00-14:00)' },
  { id: 'depot-b', coordinates: [250, 180], label: 'Depot B', description: 'Evening Shift (14:00-22:00)' },
  { id: 'depot-c', coordinates: [380, 180], label: 'Depot C', description: 'Night Shift (22:00-06:00)' },
  { id: 'depot-d', coordinates: [250, 280], label: 'Depot D', description: 'Maintenance Only (24/7)' }
];

const panoramicHotspots = [
  { id: 'toolbox', coordinates: [15, 45], evidence: false, label: 'Standard Toolbox' },
  { id: 'workbench', coordinates: [35, 40], evidence: false, label: 'Maintenance Workbench' },
  { id: 'hidden-locker', coordinates: [75, 50], evidence: true, item: 'bloodstained-wrench', label: 'Hidden Storage Locker' },
  { id: 'oil-drums', coordinates: [50, 60], evidence: false, label: 'Oil Storage Drums' }
];

// Step 1: Location Riddle Component
const LocationRiddleStep = ({ step, onStepComplete }: StationEnvironmentRiddleProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);

  const riddleText = step.content.riddle;

  const riddleOptions = step.content.options;

  const handleSubmit = () => {
    const isCorrect = selectedAnswer === step.validation.value;
    onStepComplete(selectedAnswer, isCorrect);
  };

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-blue-800 dark:text-blue-200">Step 1: The Riddle</span>
          <Badge variant="outline" className="text-xs">~8 min</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-center italic text-lg leading-relaxed font-serif text-amber-900 dark:text-amber-100">
            {riddleText.split('\n').map((line: string, index: number) => (
              <span key={index}>
                {line}
                {index < riddleText.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Which station area does this riddle describe?
          </p>
          <div className="grid gap-2">
            {riddleOptions.map((option: { id: string, text: string }) => (
              <label
                key={option.id}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedAnswer === option.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="riddle-answer"
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="mr-3"
                />
                <span className="text-slate-700 dark:text-slate-300">{option.text}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHint(!showHint)}
            className="text-xs"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Submit Answer
          </Button>
        </div>

        {showHint && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 Think about where trains go when they're not actively carrying passengers. 
              The last line is a clue about shift schedules.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Step 2: Interactive Station Map Component
const StationMapStep = ({ step, onStepComplete }: StationEnvironmentRiddleProps) => {
  const [selectedDepot, setSelectedDepot] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);

  const depotOptions = step.content.options;

  const handleSubmit = () => {
    const isCorrect = selectedDepot === step.validation.value;
    onStepComplete(selectedDepot, isCorrect);
  };

  return (
    <Card className="border-2 border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-green-800 dark:text-green-200">Step 2: Interactive Station Map</span>
          <Badge variant="outline" className="text-xs">~7 min</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-slate-600 dark:text-slate-400">
          Use the interactive station map to locate the specific depot area mentioned in the riddle.
        </p>

        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
          <svg
            viewBox="0 0 500 400"
            className="w-full h-80 border rounded-lg bg-white dark:bg-slate-900"
          >
            <rect width="500" height="400" fill="#f8fafc" className="dark:fill-slate-900" />
            
            <line x1="50" y1="100" x2="450" y2="100" stroke="#64748b" strokeWidth="4" />
            <line x1="50" y1="120" x2="450" y2="120" stroke="#64748b" strokeWidth="4" />
            
            <rect x="60" y="80" width="380" height="60" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
            <text x="250" y="115" textAnchor="middle" className="text-sm fill-slate-600 dark:fill-slate-400">
              Main Platform Area
            </text>

            {depotAreas.map((depot) => (
              <g key={depot.id}>
                <rect
                  x={depot.coordinates[0] - 40}
                  y={depot.coordinates[1] - 25}
                  width="80"
                  height="50"
                  fill={selectedDepot === depot.id ? "#3b82f6" : "#cbd5e1"}
                  stroke={selectedDepot === depot.id ? "#1d4ed8" : "#64748b"}
                  strokeWidth="2"
                  className="cursor-pointer hover:fill-blue-200 transition-colors"
                  onClick={() => setSelectedDepot(depot.id)}
                />
                <text
                  x={depot.coordinates[0]}
                  y={depot.coordinates[1] - 5}
                  textAnchor="middle"
                  className="text-xs fill-slate-700 dark:fill-slate-300 pointer-events-none"
                >
                  {depot.label}
                </text>
                <text
                  x={depot.coordinates[0]}
                  y={depot.coordinates[1] + 10}
                  textAnchor="middle"
                  className="text-xs fill-slate-500 dark:fill-slate-400 pointer-events-none"
                >
                  {depot.description.split(' ')[0]} {depot.description.split(' ')[1]}
                </text>
              </g>
            ))}

            <rect x="150" y="300" width="200" height="80" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
            <text x="250" y="345" textAnchor="middle" className="text-sm fill-slate-600 dark:fill-slate-400">
              Main Station Building
            </text>
          </svg>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Based on the riddle's last line "Where morning comes before the night", which depot should you investigate?
          </p>
          <div className="grid gap-2">
            {depotOptions.map((option: { id: string, text: string }) => (
              <label
                key={option.id}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedDepot === option.id
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="depot-answer"
                  value={option.id}
                  checked={selectedDepot === option.id}
                  onChange={(e) => setSelectedDepot(e.target.value)}
                  className="mr-3"
                />
                <span className="text-slate-700 dark:text-slate-300">{option.text}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHint(!showHint)}
            className="text-xs"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedDepot}
            className="bg-green-600 hover:bg-green-700"
          >
            Submit Selection
          </Button>
        </div>

        {showHint && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 The riddle mentions morning coming before night - think about shift schedules. 
              Morning shift would be the earliest shift of the day.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Step 3: 360° Evidence Discovery Component
const EvidenceDiscoveryStep = ({ step, onStepComplete }: StationEnvironmentRiddleProps) => {
  const [selectedEvidence, setSelectedEvidence] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [panoramicRotation, setPanoramicRotation] = useState<number>(0);
  const [hoveredHotspot, setHoveredHotspot] = useState<string>('');

  const evidenceOptions = step.content.options;

  const handleSubmit = () => {
    const isCorrect = selectedEvidence === step.validation.value;
    onStepComplete(selectedEvidence, isCorrect);
  };

  const handlePanoramicClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    panoramicHotspots.forEach(hotspot => {
      const distance = Math.sqrt(
        Math.pow(x - hotspot.coordinates[0], 2) + 
        Math.pow(y - hotspot.coordinates[1], 2)
      );
      
      if (distance < 8 && hotspot.evidence) {
        setSelectedEvidence(hotspot.item || '');
      }
    });
  };

  const rotatePanoramic = (direction: 'left' | 'right') => {
    const rotationStep = 30;
    const newRotation = direction === 'left' 
      ? panoramicRotation - rotationStep 
      : panoramicRotation + rotationStep;
    setPanoramicRotation(((newRotation % 360) + 360) % 360);
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-purple-800 dark:text-purple-200">Step 3: 360° Evidence Discovery</span>
          <Badge variant="outline" className="text-xs">~5 min</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-slate-600 dark:text-slate-400">
          Explore the 360° view of Depot A to find and identify the hidden evidence.
        </p>

        <div className="relative bg-slate-900 rounded-lg overflow-hidden">
          <div
            className="relative h-80 cursor-crosshair"
            onClick={handlePanoramicClick}
            style={{
              backgroundImage: 'linear-gradient(45deg, #1e293b 0%, #475569 50%, #1e293b 100%)',
              backgroundSize: '200% 100%',
              backgroundPosition: `${panoramicRotation}% center`,
              transition: 'background-position 0.5s ease'
            }}
          >
            <div className="absolute inset-0 opacity-60">
              <div 
                className="absolute bottom-0 left-0 w-16 h-20 bg-slate-700 rounded-t-lg"
                style={{ transform: `translateX(${(panoramicRotation * 2) % 100}px)` }}
              />
              <div 
                className="absolute bottom-0 right-0 w-12 h-24 bg-slate-600 rounded-t-lg"
                style={{ transform: `translateX(${-(panoramicRotation * 1.5) % 80}px)` }}
              />
            </div>

            {panoramicHotspots.map((hotspot) => {
              const adjustedX = (hotspot.coordinates[0] + (panoramicRotation / 10)) % 100;
              const isVisible = adjustedX > 10 && adjustedX < 90;
              
              return isVisible ? (
                <div
                  key={hotspot.id}
                  className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all ${
                    hotspot.evidence 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-blue-400 hover:bg-blue-500'
                  }`}
                  style={{
                    left: `${adjustedX}%`,
                    top: `${hotspot.coordinates[1]}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                  onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                  onMouseLeave={() => setHoveredHotspot('')}
                  onClick={() => {
                    if (hotspot.evidence && hotspot.item) {
                      setSelectedEvidence(hotspot.item);
                    }
                  }}
                >
                  {hoveredHotspot === hotspot.id && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {hotspot.label}
                    </div>
                  )}
                </div>
              ) : null;
            })}

            <div className="absolute top-4 left-4 flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => rotatePanoramic('left')}
                className="bg-black/50 hover:bg-black/70 text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => rotatePanoramic('right')}
                className="bg-black/50 hover:bg-black/70 text-white"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>

            <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full">
              <div className="text-xs font-mono">
                {Math.round(panoramicRotation)}°
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            What evidence item can you find hidden in this depot?
          </p>
          <div className="grid gap-2">
            {evidenceOptions.map((option: { id: string, text: string }) => (
              <label
                key={option.id}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedEvidence === option.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="evidence-answer"
                  value={option.id}
                  checked={selectedEvidence === option.id}
                  onChange={(e) => setSelectedEvidence(e.target.value)}
                  className="mr-3"
                />
                <span className="text-slate-700 dark:text-slate-300">{option.text}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHint(!showHint)}
            className="text-xs"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedEvidence}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Submit Evidence
          </Button>
        </div>

        {showHint && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 Look for objects that seem out of place or partially hidden. 
              Click on suspicious areas in the 360° view. Red hotspots indicate evidence!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Station Environment Riddle Component
export const StationEnvironmentRiddle = ({ step, onStepComplete, className }: StationEnvironmentRiddleProps) => {
  switch (step.id) {
    case 'location-riddle':
      return <LocationRiddleStep step={step} onStepComplete={onStepComplete} />;
    case 'platform-identification-map':
      return <StationMapStep step={step} onStepComplete={onStepComplete} />;
    case 'evidence-discovery-360':
      return <EvidenceDiscoveryStep step={step} onStepComplete={onStepComplete} />;
    default:
      return null;
  }
}; 