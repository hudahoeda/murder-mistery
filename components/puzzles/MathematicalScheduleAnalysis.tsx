'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, Clock, AlertTriangle, Calculator, Users, TrendingUp, Calendar } from 'lucide-react';
import { PuzzleStep } from '@/lib/types/game';

interface MathematicalScheduleAnalysisProps {
  step: PuzzleStep;
  onStepComplete: (answer: any, isCorrect: boolean) => void;
  onHintUsed: () => void;
}

interface TrainSchedule {
  route: string;
  departure: string;
  duration: number;
  frequency: number;
}

interface StaffSchedule {
  name: string;
  shift: string;
  break: string;
  location: string;
}

interface PassengerCountData {
  time: string;
  arrivals: number;
  departures: number;
  platform_2: number;
}

const MathematicalScheduleAnalysis: React.FC<MathematicalScheduleAnalysisProps> = ({
  step,
  onStepComplete,
  onHintUsed,
}) => {
  const [timeCalculationAnswer, setTimeCalculationAnswer] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [anomalyAnswer, setAnomalyAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setTimeCalculationAnswer('');
    setSelectedStaff('');
    setAnomalyAnswer('');
    setShowHint(false);
  }, [step]);

  const trainSchedule: TrainSchedule[] = step.content.schedule;
  const staffSchedules: StaffSchedule[] = step.content.staffSchedules;
  const passengerFlowData: PassengerCountData[] = step.content.passengerData || [];

  const validateStep1 = () => {
    return timeCalculationAnswer === step.validation.value;
  };

  const validateStep2 = () => {
    return selectedStaff === step.validation.value;
  };

  const validateStep3 = () => {
    const answerAsNumber = parseInt(anomalyAnswer, 10);
    return !isNaN(answerAsNumber) && answerAsNumber === step.validation.value;
  };

  const handleStepSubmit = () => {
    let isCorrect = false;
    let answer: any = null;

    switch(step.id) {
        case 'time-calculations':
            isCorrect = validateStep1();
            answer = timeCalculationAnswer;
            break;
        case 'staff-schedule-correlation':
            isCorrect = validateStep2();
            answer = selectedStaff;
            break;
        case 'passenger-anomaly-analysis':
            isCorrect = validateStep3();
            answer = anomalyAnswer;
            break;
    }
    onStepComplete(answer, isCorrect);
  };

  const getAnomalyRowClass = (variance: number) => {
    const isSignificant = Math.abs(variance) > 10;
    return isSignificant ? 'bg-red-50 dark:bg-red-900/20' : '';
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Train Schedule Database
          </CardTitle>
          <CardDescription>
            Current evening schedule with departure times and frequencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="border border-gray-300 p-3 text-left">Route</th>
                  <th className="border border-gray-300 p-3 text-left">Scheduled Departure</th>
                  <th className="border border-gray-300 p-3 text-left">Journey Duration (min)</th>
                  <th className="border border-gray-300 p-3 text-left">Frequency (min)</th>
                </tr>
              </thead>
              <tbody>
                {trainSchedule.map((train: TrainSchedule, index: number) => (
                  <tr key={index} className={train.route === 'Bekasi' ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                    <td className="border border-gray-300 p-3 font-medium">{train.route}</td>
                    <td className="border border-gray-300 p-3 font-mono">{train.departure}</td>
                    <td className="border border-gray-300 p-3">{train.duration}</td>
                    <td className="border border-gray-300 p-3">{train.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {trainSchedule.find((t: TrainSchedule) => t.route === 'Bekasi') && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
              <Badge className="bg-red-100 text-red-800 mb-2">DELAY ALERT</Badge>
              <p className="text-sm text-red-700 dark:text-red-300">
                Bekasi train (19:45) delayed by 15 minutes due to signal maintenance
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-600" />
            Schedule Conflict Calculation
          </CardTitle>
          <CardDescription>
            Calculate the new departure time considering delay constraints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Calculation Requirements:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Original Bekasi departure: 19:45</li>
              <li>• Delay: +15 minutes</li>
              <li>• Serpong departure: 19:50 (cannot be moved)</li>
              <li>• Minimum interval: 5 minutes between departures</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Calculation Steps:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline">1</Badge>
                <span>Bekasi original time: 19:45</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">2</Badge>
                <span>Add 15-minute delay: 19:45 + 15 min = 20:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">3</Badge>
                <span>Check conflicts: Serpong at 19:50 (no conflict)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">4</Badge>
                <span>Next train: Tanah Abang at 20:00 (CONFLICT!)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">5</Badge>
                <span>Apply 5-minute minimum interval...</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="time-calc">
              What would be the earliest possible departure time for the delayed Bekasi train?
            </Label>
            <Input
              id="time-calc"
              value={timeCalculationAnswer}
              onChange={(e) => setTimeCalculationAnswer(e.target.value)}
              placeholder="Enter time in HH:MM format"
              className="mt-2"
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
            <Users className="w-5 h-5 text-green-600" />
            Staff Schedule Analysis
          </CardTitle>
          <CardDescription>
            Examine who was on duty during the critical time period (20:15)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staffSchedules.map((staff: StaffSchedule, index: number) => {
              const isOnDuty = staff.shift.includes('20:00') || 
                              (staff.shift.includes('19:00') && staff.shift.includes('03:00')) ||
                              (staff.shift.includes('18:00') && staff.shift.includes('02:00')) ||
                              (staff.shift.includes('16:00') && staff.shift.includes('00:00')) ||
                              (staff.shift.includes('14:00') && staff.shift.includes('22:00')) ||
                              (staff.shift.includes('05:00') && staff.shift.includes('21:00'));
              
              const hasMaintenanceAccess = staff.location.toLowerCase().includes('maintenance') || 
                                         staff.location.toLowerCase().includes('patrol');

              return (
                <div key={index} className={`border rounded-lg p-4 ${isOnDuty ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{staff.name}</h3>
                    <div className="flex gap-2">
                      {isOnDuty && <Badge className="bg-green-100 text-green-800">On Duty</Badge>}
                      {hasMaintenanceAccess && <Badge className="bg-blue-100 text-blue-800">Area Access</Badge>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Shift:</span> {staff.shift}
                    </div>
                    <div>
                      <span className="font-medium">Break:</span> {staff.break}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {staff.location}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Critical Time Analysis</CardTitle>
          <CardDescription>
            At 20:15 (estimated time of murder), identify staff with maintenance/storage access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg mb-4">
            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Critical Requirements:</h4>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              <li>• On duty at 20:15 (8:15 PM)</li>
              <li>• Has access to maintenance/storage areas</li>
              <li>• Not on scheduled break</li>
            </ul>
          </div>

          <RadioGroup value={selectedStaff} onValueChange={setSelectedStaff}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="rahman-agus" id="rahman-agus" />
                <Label htmlFor="rahman-agus" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Rahman Pratama and Agus Santoso</span>
                    <div className="flex gap-2">
                      <Badge className="bg-green-100 text-green-800">Both On Duty</Badge>
                      <Badge className="bg-blue-100 text-blue-800">Area Access</Badge>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="sari-maya" id="sari-maya" />
                <Label htmlFor="sari-maya" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Sari Indraswari and Maya Kusuma</span>
                    <Badge variant="secondary">Limited Access</Badge>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="bayu-fitri" id="bayu-fitri" />
                <Label htmlFor="bayu-fitri" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Bayu Nugroho and Fitri Maharani</span>
                    <Badge variant="secondary">No Maintenance Access</Badge>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="all-staff" id="all-staff" />
                <Label htmlFor="all-staff" className="flex-1 cursor-pointer">
                  <span className="font-medium">All staff were on duty</span>
                </Label>
              </div>
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
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Passenger Flow Analysis
          </CardTitle>
          <CardDescription>
            Statistical analysis of passenger counts during the incident timeframe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 dark:border-slate-600">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <th className="border border-slate-300 dark:border-slate-600 p-3 text-left">Time Slot</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-3 text-right">Arrivals</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-3 text-right">Departures</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-3 text-right">Platform 2 Count</th>
                </tr>
              </thead>
              <tbody>
                {passengerFlowData.map((data: PassengerCountData, index: number) => {
                  const isCriticalTime = data.time === '19:45' || data.time === '20:15';
                  return (
                    <tr key={index} className={isCriticalTime ? 'bg-amber-50 dark:bg-amber-900/20' : ''}>
                      <td className="border border-slate-300 dark:border-slate-600 p-3 font-mono">{data.time}</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-3 text-right">{data.arrivals}</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-3 text-right">{data.departures}</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-3 text-right font-semibold">{data.platform_2}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Passenger Anomaly Calculation</CardTitle>
          <CardDescription>
            {step.content.question}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {step.content.context}
            </p>
          </div>
          <div>
            <Label htmlFor="anomaly-answer">
              Enter your calculated percentage drop (rounded to the nearest whole number):
            </Label>
            <Input
              id="anomaly-answer"
              type="number"
              value={anomalyAnswer}
              onChange={(e) => setAnomalyAnswer(e.target.value)}
              placeholder="Enter calculated percentage"
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Calculator className="w-8 h-8 text-purple-600" />
            {step.title}
          </CardTitle>
          <CardDescription className="text-lg">
            {step.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Current Step Content */}
      {step.id === 'time-calculations' && renderStep1()}
      {step.id === 'staff-schedule-correlation' && renderStep2()}
      {step.id === 'passenger-anomaly-analysis' && renderStep3()}

      {/* Hint Alert */}
      {showHint && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {step.hintText}
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
            (step.id === 'time-calculations' && !timeCalculationAnswer) ||
            (step.id === 'staff-schedule-correlation' && !selectedStaff) ||
            (step.id === 'passenger-anomaly-analysis' && !anomalyAnswer)
          }
        >
          Submit Answer
        </Button>
      </div>
    </div>
  );
};

export default MathematicalScheduleAnalysis; 