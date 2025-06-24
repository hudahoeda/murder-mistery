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
import { PuzzleStep } from '@/lib/types/game';

interface WitnessStatementAnalysisProps {
  step: PuzzleStep;
  onStepComplete: (answer: any, isCorrect: boolean) => void;
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
  step,
  onStepComplete,
  onHintUsed,
}) => {
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo>({
    patrolStart: '',
    victimLocation: '',
    officesCheck: '',
    discoveryLocation: ''
  });
  const [selectedContradiction, setSelectedContradiction] = useState('');
  const [timelineAnswer, setTimelineAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [highlightedText, setHighlightedText] = useState<string>('');

  const witnessStatement: string = step.content.statement;
  const timelineEvents: TimelineEvent[] = step.content.events;
  const evidenceItems: {type: string, description: string}[] = step.content.evidence;

  const validateStep1 = () => {
    return Object.values(extractedInfo).every(v => v.length > 0);
  };

  const validateStep2 = () => {
    return selectedContradiction === step.validation.value;
  };

  const validateStep3 = () => {
    return timelineAnswer.includes(step.validation.value);
  };

  const handleStepSubmit = () => {
    let isCorrect = false;
    let answer: any = null;
    
    switch(step.id) {
        case 'statement-extraction':
            isCorrect = validateStep1();
            answer = extractedInfo;
            break;
        case 'alibi-verification':
            isCorrect = validateStep2();
            answer = selectedContradiction;
            break;
        case 'timeline-construction':
            isCorrect = validateStep3();
            answer = timelineAnswer;
            break;
    }
    onStepComplete(answer, isCorrect);
  };

  useEffect(() => {
    const highlightKeyInfo = () => {
      let highlighted = witnessStatement;
      highlighted = highlighted.replace(/(\d{1,2}:\d{2}\s*PM)/g, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
      highlighted = highlighted.replace(/(ticket counters|upper level offices|information desk)/g, '<mark class="bg-blue-200 dark:bg-blue-800">$1</mark>');
      highlighted = highlighted.replace(/(Pak Budi|Agus)/g, '<mark class="bg-green-200 dark:bg-green-800">$1</mark>');
      setHighlightedText(highlighted);
    };
    if (witnessStatement) {
        highlightKeyInfo();
    }
  }, [witnessStatement]);

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
            <Input id="patrol-start" value={extractedInfo.patrolStart} onChange={(e) => setExtractedInfo(prev => ({ ...prev, patrolStart: e.target.value }))} placeholder="e.g., 7:15 PM" />
          </div>
          <div>
            <Label htmlFor="victim-location">Where did Rahman see the victim?</Label>
            <Input id="victim-location" value={extractedInfo.victimLocation} onChange={(e) => setExtractedInfo(prev => ({ ...prev, victimLocation: e.target.value }))} placeholder="Location where victim was seen" />
          </div>
          <div>
            <Label htmlFor="offices-check">What time did Rahman check the upper level offices?</Label>
            <Input id="offices-check" value={extractedInfo.officesCheck} onChange={(e) => setExtractedInfo(prev => ({ ...prev, officesCheck: e.target.value }))} placeholder="e.g., 8:00 PM" />
          </div>
          <div>
            <Label htmlFor="discovery-location">Where was Rahman when the body was discovered?</Label>
            <Input id="discovery-location" value={extractedInfo.discoveryLocation} onChange={(e) => setExtractedInfo(prev => ({ ...prev, discoveryLocation: e.target.value }))} placeholder="Rahman's location during discovery" />
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
            {evidenceItems.map((item: {type: string, description: string}, index: number) => (
              <div key={index} className="p-3 border rounded-lg">
                <Badge className={ item.type === 'cctv' ? 'bg-blue-100 text-blue-800' : item.type === 'witness' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800' }>
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
            {(step.content.options as {id: string, text: string}[]).map(option => (
                 <div className="flex items-center space-x-2" key={option.id}>
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id}>{option.text}</Label>
                </div>
            ))}
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
            {timelineEvents.map((event: TimelineEvent, index: number) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                <Badge variant="outline" className="font-mono">{event.time}</Badge>
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
              <Input id="timeline-answer" value={timelineAnswer} onChange={(e) => setTimelineAnswer(e.target.value)} placeholder="e.g., 20:15-20:25 or 8:15-8:25 PM" />
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
            {step.title}
          </CardTitle>
          <CardDescription className="text-lg">
            {step.description}
          </CardDescription>
        </CardHeader>
      </Card>
      {step.id === 'statement-extraction' && renderStep1()}
      {step.id === 'alibi-verification' && renderStep2()}
      {step.id === 'timeline-construction' && renderStep3()}
      {showHint && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {step.hintText}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex gap-3">
        <Button onClick={() => { setShowHint(true); onHintUsed(); }} variant="outline" disabled={showHint}>
          Show Hint
        </Button>
        <Button 
          onClick={handleStepSubmit}
          disabled={
            (step.id === 'statement-extraction' && Object.values(extractedInfo).some(v => v === '')) ||
            (step.id === 'alibi-verification' && !selectedContradiction) ||
            (step.id === 'timeline-construction' && !timelineAnswer)
          }
        >
          Submit Answer
        </Button>
      </div>
    </div>
  );
};

export default WitnessStatementAnalysis; 