'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, Clock, AlertTriangle, Users, FileText, Calendar } from 'lucide-react';

interface WitnessStatementAnalysisProps {
  onComplete: (success: boolean, timeSpent: number) => void;
  onHintUsed: () => void;
}

interface TimelineEvent {
  time: string;
  description: string;
  source: string;
  confirmed: boolean;
}

interface ExtractedInfo {
  patrolStart: string;
  victimLocation: string;
  officesCheck: string;
  discoveryLocation: string;
}

const WitnessStatementAnalysis: React.FC<WitnessStatementAnalysisProps> = ({
  onComplete,
  onHintUsed,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [startTime] = useState(Date.now());
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo>({
    patrolStart: '',
    victimLocation: '',
    officesCheck: '',
    discoveryLocation: ''
  });
  const [selectedContradiction, setSelectedContradiction] = useState('');
  const [timelineAnswer, setTimelineAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [stepResults, setStepResults] = useState<boolean[]>([]);
  const [highlightedText, setHighlightedText] = useState<string>('');

  const witnessStatement = `I was doing my regular security patrol around the station from 7:15 PM onwards. I remember seeing Pak Budi near the ticket counters around 7:50 PM - he seemed to be in a hurry. I continued my rounds, checking the upper level offices around 8:00 PM. I didn't see anything unusual until we found the body at 8:45 PM. I was near the information desk when Agus came running to report the discovery.`;

  const timelineEvents: TimelineEvent[] = [
    { time: "19:50", description: "Pak Budi seen at ticket counters", source: "Rahman's statement + CCTV", confirmed: true },
    { time: "20:05", description: "Rahman enters upper level", source: "CCTV Camera 3", confirmed: true },
    { time: "20:15", description: "Rahman near storage area", source: "Maya's witness account", confirmed: true },
    { time: "20:18", description: "Rahman accesses storage room", source: "Security log", confirmed: true },
    { time: "20:25", description: "Rahman exits upper level", source: "CCTV Camera 3", confirmed: true },
    { time: "20:45", description: "Body discovered by Agus", source: "Multiple witnesses", confirmed: true }
  ];

  const evidenceItems = [
    {
      type: "cctv",
      description: "CCTV Camera 3 (Upper Level): Shows Rahman entering administrative area at 8:05 PM, exiting at 8:25 PM"
    },
    {
      type: "witness", 
      description: "Maya (Ticket Clerk): 'I saw Rahman talking to someone near the storage area around 8:15 PM, but couldn't see who it was.'"
    },
    {
      type: "evidence",
      description: "Security log: Rahman's keycard accessed storage room at 8:18 PM"
    }
  ];

  const validateStep1 = () => {
    const correct = 
      extractedInfo.patrolStart.includes('7:15') &&
      extractedInfo.victimLocation.toLowerCase().includes('ticket counter') &&
      extractedInfo.officesCheck.includes('8:00') &&
      extractedInfo.discoveryLocation.toLowerCase().includes('information desk');
    
    return correct;
  };

  const validateStep2 = () => {
    return selectedContradiction === 'location-lie';
  };

  const validateStep3 = () => {
    return timelineAnswer.includes('20:15-20:25') || (timelineAnswer.includes('8:15') && timelineAnswer.includes('8:25'));
  };

  const handleStepSubmit = () => {
    let isCorrect = false;
    
    if (currentStep === 1) {
      isCorrect = validateStep1();
    } else if (currentStep === 2) {
      isCorrect = validateStep2();
    } else if (currentStep === 3) {
      isCorrect = validateStep3();
    }

    const newResults = [...stepResults];
    newResults[currentStep - 1] = isCorrect;
    setStepResults(newResults);

    if (isCorrect) {
      if (currentStep === 3) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        onComplete(true, timeSpent);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const getStepIcon = (stepNum: number) => {
    if (stepResults[stepNum - 1] === true) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (stepNum === currentStep) {
      return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
    } else {
      return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const highlightKeyInfo = () => {
    let highlighted = witnessStatement;
    
    // Highlight times
    highlighted = highlighted.replace(/(\d{1,2}:\d{2}\s*PM)/g, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
    
    // Highlight locations
    highlighted = highlighted.replace(/(ticket counters|upper level offices|information desk)/g, '<mark class="bg-blue-200 dark:bg-blue-800">$1</mark>');
    
    // Highlight names
    highlighted = highlighted.replace(/(Pak Budi|Agus)/g, '<mark class="bg-green-200 dark:bg-green-800">$1</mark>');
    
    setHighlightedText(highlighted);
  };

  useEffect(() => {
    highlightKeyInfo();
  }, []);

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Rahman's Security Statement
        </h3>
        <div 
          className="text-sm leading-relaxed font-mono"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Extract Key Information</CardTitle>
          <CardDescription>
            Answer the following questions based on Rahman's statement:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="patrol-start">What time did Rahman start his patrol?</Label>
            <Input
              id="patrol-start"
              value={extractedInfo.patrolStart}
              onChange={(e) => setExtractedInfo(prev => ({ ...prev, patrolStart: e.target.value }))}
              placeholder="e.g., 7:15 PM"
            />
          </div>
          
          <div>
            <Label htmlFor="victim-location">Where did Rahman see the victim?</Label>
            <Input
              id="victim-location"
              value={extractedInfo.victimLocation}
              onChange={(e) => setExtractedInfo(prev => ({ ...prev, victimLocation: e.target.value }))}
              placeholder="Location where victim was seen"
            />
          </div>
          
          <div>
            <Label htmlFor="offices-check">What time did Rahman check the upper level offices?</Label>
            <Input
              id="offices-check"
              value={extractedInfo.officesCheck}
              onChange={(e) => setExtractedInfo(prev => ({ ...prev, officesCheck: e.target.value }))}
              placeholder="e.g., 8:00 PM"
            />
          </div>
          
          <div>
            <Label htmlFor="discovery-location">Where was Rahman when the body was discovered?</Label>
            <Input
              id="discovery-location"
              value={extractedInfo.discoveryLocation}
              onChange={(e) => setExtractedInfo(prev => ({ ...prev, discoveryLocation: e.target.value }))}
              placeholder="Rahman's location during discovery"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Cross-Reference Evidence
          </CardTitle>
          <CardDescription>
            Compare Rahman's statement with additional evidence sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {evidenceItems.map((item, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <Badge className={
                  item.type === 'cctv' ? 'bg-blue-100 text-blue-800' :
                  item.type === 'witness' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }>
                  {item.type.toUpperCase()}
                </Badge>
                <p className="mt-2 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Identify the Contradiction</CardTitle>
          <CardDescription>
            What contradiction exists between Rahman's statement and the evidence?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedContradiction} onValueChange={setSelectedContradiction}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="time-mismatch" id="time-mismatch" />
              <Label htmlFor="time-mismatch">
                He claims to have checked offices at 8:00 PM, but CCTV shows 8:05 PM
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="location-lie" id="location-lie" />
              <Label htmlFor="location-lie">
                He claims he was near information desk during discovery, but evidence shows he was at storage area
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no-contradiction" id="no-contradiction" />
              <Label htmlFor="no-contradiction">
                No significant contradictions found
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="witness-unreliable" id="witness-unreliable" />
              <Label htmlFor="witness-unreliable">
                Maya's testimony is unreliable due to distance
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Evidence Timeline
          </CardTitle>
          <CardDescription>
            Review the chronological evidence to identify the critical time gap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timelineEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                <Badge variant="outline" className="font-mono">
                  {event.time}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium">{event.description}</p>
                  <p className="text-sm text-gray-600">Source: {event.source}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Critical Time Gap Analysis</CardTitle>
          <CardDescription>
            During which time period was Rahman unaccounted for and near the crime scene?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Estimated time of death: Around 8:15 PM (20:15)
              </p>
            </div>
            <div>
              <Label htmlFor="timeline-answer">
                Enter the time range when Rahman was near the storage area:
              </Label>
              <Input
                id="timeline-answer"
                value={timelineAnswer}
                onChange={(e) => setTimelineAnswer(e.target.value)}
                placeholder="e.g., 20:15-20:25 or 8:15-8:25 PM"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-600" />
            Witness Statement Analysis
          </CardTitle>
          <CardDescription className="text-lg">
            Examine conflicting witness testimonies and build an accurate timeline of events
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStepIcon(1)}
              <span className={currentStep === 1 ? 'font-semibold text-blue-600' : 'text-gray-600'}>
                Statement Extraction
              </span>
            </div>
            <div className="flex-1 mx-4">
              <Progress value={currentStep >= 2 ? 100 : currentStep === 1 ? 50 : 0} className="h-2" />
            </div>
            <div className="flex items-center gap-3">
              {getStepIcon(2)}
              <span className={currentStep === 2 ? 'font-semibold text-blue-600' : 'text-gray-600'}>
                Alibi Verification
              </span>
            </div>
            <div className="flex-1 mx-4">
              <Progress value={currentStep >= 3 ? 100 : currentStep === 2 ? 50 : 0} className="h-2" />
            </div>
            <div className="flex items-center gap-3">
              {getStepIcon(3)}
              <span className={currentStep === 3 ? 'font-semibold text-blue-600' : 'text-gray-600'}>
                Timeline Construction
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      {/* Hint Alert */}
      {showHint && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {currentStep === 1 && "Look for specific times, locations, and actions mentioned in the statement."}
            {currentStep === 2 && "Compare Rahman's claimed location during the body discovery with Maya's witness account and the keycard access log."}
            {currentStep === 3 && "Look for the overlap between Rahman's presence near the storage area and the estimated time of death (around 8:15 PM)."}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={() => { setShowHint(true); onHintUsed(); }} 
          variant="outline"
          disabled={showHint}
        >
          Show Hint
        </Button>
        <Button 
          onClick={handleStepSubmit}
          disabled={
            (currentStep === 1 && (!extractedInfo.patrolStart || !extractedInfo.victimLocation || !extractedInfo.officesCheck || !extractedInfo.discoveryLocation)) ||
            (currentStep === 2 && !selectedContradiction) ||
            (currentStep === 3 && !timelineAnswer)
          }
        >
          {currentStep === 3 ? 'Complete Analysis' : 'Next Step'}
        </Button>
      </div>
    </div>
  );
};

export default WitnessStatementAnalysis; 