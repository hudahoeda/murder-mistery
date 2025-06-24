'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, Clock, AlertTriangle, Camera, Search, Users, Settings } from 'lucide-react';
import { PuzzleStep } from '@/lib/types/game';

interface CCTVImageAnalysisProps {
  step: PuzzleStep;
  onStepComplete: (answer: any, isCorrect: boolean) => void;
  onHintUsed: () => void;
}

interface ImageSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}

interface BrandInfo {
  brand: string;
  image: string;
  distinctive: string;
}

interface SuspectTool {
  suspect: string;
  tools: string;
}

const CCTVImageAnalysis: React.FC<CCTVImageAnalysisProps> = ({
  step,
  onStepComplete,
  onHintUsed,
}) => {
  const [imageSettings, setImageSettings] = useState<ImageSettings>({
    brightness: 0,
    contrast: 100,
    saturation: 100,
    blur: 0
  });
  const [selectedBrand, setSelectedBrand] = useState('');
  const [ownershipAnswer, setOwnershipAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [stepResults, setStepResults] = useState<boolean[]>([]);
  const [imageEnhanced, setImageEnhanced] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);

  const targetSettings = useMemo(() => ({
    brightness: 20,
    contrast: 150,
    saturation: 80,
    blur: 0
  }), []);

  const brandDatabase: BrandInfo[] = step.content?.brandDatabase || [
    { brand: "Stanley", image: "/images/tools/stanley-wrench.png", distinctive: "Yellow handle with black grip" },
    { brand: "Craftsman", image: "/images/tools/craftsman-wrench.png", distinctive: "Red handle with silver head" },
    { brand: "Tekiro", image: "/images/tools/tekiro-wrench.png", distinctive: "Blue handle with chrome finish" },
    { brand: "Krisbow", image: "/images/tools/krisbow-wrench.png", distinctive: "Green handle with black band" }
  ];

  const suspectTools: SuspectTool[] = [
    { suspect: "Sari Indraswari", tools: "Official station master equipment - no personal tools" },
    { suspect: "Rahman Pratama", tools: "Security equipment, radio, no maintenance tools reported" },
    { suspect: "Maya Kusuma", tools: "Computer peripherals, no mechanical tools" },
    { suspect: "Agus Santoso", tools: "Full Tekiro tool set including wrenches - issued by maintenance department" },
    { suspect: "Indira Wulandari", tools: "Cleaning equipment, no heavy tools" },
    { suspect: "Bayu Nugroho", tools: "Audio equipment, no mechanical tools" },
    { suspect: "Fitri Maharani", tools: "Kitchen equipment and utensils" }
  ];

  const checkImageEnhancement = useCallback(() => {
    const tolerance = 10;
    const isEnhanced = 
      Math.abs(imageSettings.brightness - targetSettings.brightness) <= tolerance &&
      Math.abs(imageSettings.contrast - targetSettings.contrast) <= tolerance &&
      Math.abs(imageSettings.saturation - targetSettings.saturation) <= tolerance &&
      Math.abs(imageSettings.blur - targetSettings.blur) <= tolerance;
    
    setImageEnhanced(isEnhanced);
    return isEnhanced;
  }, [imageSettings, targetSettings]);

  const applyImageFilters = useCallback(() => {
    const canvas = canvasRef.current;
    
    if (!canvas || !image) {
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    // Apply filters using CSS filter style
    const filterString = [
      `brightness(${100 + imageSettings.brightness}%)`,
      `contrast(${imageSettings.contrast}%)`,
      `saturate(${imageSettings.saturation}%)`,
      `blur(${imageSettings.blur}px)`
    ].join(' ');

    ctx.filter = filterString;
    ctx.drawImage(image, 0, 0);
    
    // Reset filter for future operations
    ctx.filter = 'none';
  }, [imageSettings, image]);

  useEffect(() => {
    applyImageFilters();
    checkImageEnhancement();
  }, [imageSettings, applyImageFilters, checkImageEnhancement]);

  // Apply filters when image is loaded
  useEffect(() => {
    if (image) {
      applyImageFilters();
    }
  }, [image, applyImageFilters]);

  useEffect(() => {
    const loadImage = () => {
      // Load original image when component mounts
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setImage(img);
      };
      img.onerror = (error) => {
        console.error('❌ Failed to load image:', imagePath, error);
      };
      // Use the image path from step.content or fallback to existing image
      const imagePath = step.content?.originalImage || '/images/evidence/cctv-platform2-timestamp.png';
      img.src = imagePath;
    };
    loadImage();
  }, [step.content?.originalImage]);

  const validateStep1 = useCallback(() => {
    return checkImageEnhancement();
  }, [checkImageEnhancement]);

  const validateStep2 = () => {
    return selectedBrand === 'tekiro';
  };

  const validateStep3 = () => {
    return ownershipAnswer.toLowerCase().includes('agus santoso');
  };

  const handleStepSubmit = () => {
    let isCorrect = false;
    let answer: any = null;

    switch(step.id) {
        case 'image-enhancement':
            isCorrect = validateStep1();
            answer = imageSettings;
            break;
        case 'brand-identification':
            isCorrect = validateStep2();
            answer = selectedBrand;
            break;
        case 'ownership-correlation':
            isCorrect = validateStep3();
            answer = ownershipAnswer;
            break;
    }
    onStepComplete(answer, isCorrect);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            CCTV Footage Enhancement
          </CardTitle>
          <CardDescription>
            Use image processing tools to enhance the blurry footage from Camera 7
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Image */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Original Footage</h3>
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                {image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={originalImageRef}
                      src={image.src}
                      alt="Original CCTV footage"
                      className="w-full h-auto rounded filter blur-sm brightness-75 contrast-75"
                      width={500}
                      height={300}
                    />
                    <Badge variant="outline" className="mt-2">
                      Camera 7 - 20:12:43
                    </Badge>
                  </>
                ) : (
                  <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-gray-500">Loading image...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Image */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Enhanced Image</h3>
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto rounded"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                {imageEnhanced && (
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    ✓ Tool Visible
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            Image Processing Controls
          </CardTitle>
          <CardDescription>
            Adjust the settings to clearly reveal the object in the suspect's hand
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Brightness: {imageSettings.brightness}</Label>
              <Slider
                value={[imageSettings.brightness]}
                onValueChange={(value) => setImageSettings(prev => ({ ...prev, brightness: value[0] }))}
                min={-50}
                max={50}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Contrast: {imageSettings.contrast}%</Label>
              <Slider
                value={[imageSettings.contrast]}
                onValueChange={(value) => setImageSettings(prev => ({ ...prev, contrast: value[0] }))}
                min={50}
                max={200}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Saturation: {imageSettings.saturation}%</Label>
              <Slider
                value={[imageSettings.saturation]}
                onValueChange={(value) => setImageSettings(prev => ({ ...prev, saturation: value[0] }))}
                min={0}
                max={200}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Blur Reduction: {10 - imageSettings.blur}</Label>
              <Slider
                value={[imageSettings.blur]}
                onValueChange={(value) => setImageSettings(prev => ({ ...prev, blur: value[0] }))}
                min={0}
                max={10}
                step={0.1}
                className="mt-2"
              />
            </div>
          </div>

          {imageEnhanced && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Excellent! The tool is now clearly visible. You can see what appears to be a wrench in the suspect's hand.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-600" />
            Brand Identification Database
          </CardTitle>
          <CardDescription>
            Compare the enhanced image with known tool brands to identify the specific item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandDatabase.map((brand, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{brand.brand}</h3>
                  <Badge variant="outline">Reference</Badge>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 h-32 flex items-center justify-center">
                  {brand.image ? (
                    <img 
                      src={brand.image} 
                      alt={`${brand.brand} wrench`}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">
                      [{brand.brand} Wrench Image]
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{brand.distinctive}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enhanced CCTV Analysis</CardTitle>
          <CardDescription>
            Based on the visible handle color and design in the enhanced image
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <h4 className="font-medium mb-2">Enhanced Image Analysis</h4>
            {step.content?.enhancedImage ? (
              <div className="mb-3">
                <img 
                  src={step.content.enhancedImage} 
                  alt="Enhanced CCTV footage"
                  className="max-w-full h-auto rounded border"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                The enhanced CCTV footage clearly shows a wrench with a distinctive blue handle and chrome finish. 
                The grip pattern and color are consistent with professional-grade tools.
              </p>
            )}
          </div>

          <RadioGroup value={selectedBrand} onValueChange={setSelectedBrand}>
            <div className="space-y-3">
              {brandDatabase.map((brand) => (
                <div key={brand.brand} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value={brand.brand.toLowerCase()} id={brand.brand.toLowerCase()} />
                  <Label htmlFor={brand.brand.toLowerCase()} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{brand.brand}</span>
                      <span className="text-sm text-gray-500">{brand.distinctive}</span>
                    </div>
                  </Label>
                </div>
              ))}
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
            <Users className="w-5 h-5 text-orange-600" />
            Suspect Tool Inventory
          </CardTitle>
          <CardDescription>
            Cross-reference the identified tool brand with suspect profiles and station records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suspectTools.map((suspect, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{suspect.suspect}</h3>
                  <Badge variant={suspect.tools.toLowerCase().includes('tekiro') ? 'default' : 'secondary'}>
                    {suspect.tools.toLowerCase().includes('tekiro') ? 'Tekiro Access' : 'No Match'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{suspect.tools}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Station Inventory Records</CardTitle>
          <CardDescription>
            Additional context from maintenance department records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Maintenance Department Record
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                "Maintenance department issued Tekiro tool sets to all engineering staff in 2023. 
                Each set includes various wrenches, screwdrivers, and specialized railway maintenance tools."
              </p>
            </div>

            <div>
              <Label htmlFor="ownership-answer" className="font-medium">
                Which suspect would have legitimate access to a Tekiro wrench matching the one in the CCTV footage?
              </Label>
              <Input
                id="ownership-answer"
                value={ownershipAnswer}
                onChange={(e) => setOwnershipAnswer(e.target.value)}
                placeholder="Enter the suspect's full name"
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Consider both job responsibilities and tool access privileges
              </p>
            </div>
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
            <Camera className="w-8 h-8 text-blue-600" />
            {step.title}
          </CardTitle>
          <CardDescription className="text-lg">
            {step.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Current Step Content */}
      {step.id === 'image-enhancement' && renderStep1()}
      {step.id === 'brand-identification' && renderStep2()}
      {step.id === 'ownership-correlation' && renderStep3()}

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
            (step.id === 'image-enhancement' && !imageEnhanced) ||
            (step.id === 'brand-identification' && !selectedBrand) ||
            (step.id === 'ownership-correlation' && !ownershipAnswer)
          }
        >
          Submit Answer
        </Button>
      </div>
    </div>
  );
};

export default CCTVImageAnalysis; 