'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Camera,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Recycle,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { runClassification } from '@/app/dashboard/scan/actions';
import type { ClassifyComponentOutput } from '@/ai/flows/classify-component';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { generateUpcyclingIdeas } from '@/ai/flows/generate-upcycling-ideas';

type Status = 'idle' | 'camera_active' | 'loading' | 'results';
type AIResult = ClassifyComponentOutput & { error?: undefined };
type FeedbackStatus = 'unsubmitted' | 'submitted';

export function ComponentScanner() {
  const [status, setStatus] = useState<Status>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<AIResult | null>(null);
  const [upcyclingIdeas, setUpcyclingIdeas] = useState<string[]>([]);
  const [isIdeasLoading, setIdeasLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackStatus>('unsubmitted');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const handleStartCamera = async () => {
    stopCamera();
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStatus('camera_active');
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast({
        variant: 'destructive',
        title: 'Camera Error',
        description:
          'Could not access the camera. Please check permissions and try again.',
      });
    }
  };

  const processImage = async (dataUrl: string) => {
    setCapturedImage(dataUrl);
    stopCamera();
    setStatus('loading');
    setResult(null);
    setUpcyclingIdeas([]);
    setFeedback('unsubmitted');

    const response = await runClassification(dataUrl);
    if ('error' in response) {
      toast({
        variant: 'destructive',
        title: 'Classification Failed',
        description: response.error,
      });
      setStatus('idle');
    } else {
      setResult(response as AIResult);
      setStatus('results');
      if(response.recyclable) {
        handleGenerateIdeas(response.componentType);
      }
    }
  };


  const handleCapture = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        processImage(dataUrl);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          processImage(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateIdeas = async (componentType: string) => {
    if (componentType) {
      setIdeasLoading(true);
      setUpcyclingIdeas([]);
      try {
        const response = await generateUpcyclingIdeas({
          componentType: componentType,
        });
        setUpcyclingIdeas(response.ideas);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Idea Generation Failed',
          description: 'Could not generate upcycling ideas.',
        });
      } finally {
        setIdeasLoading(false);
      }
    }
  };
  
  const handleFeedback = (isCorrect: boolean) => {
    setFeedback('submitted');
    // In a real application, this feedback would be sent to a backend
    // for retraining or analysis.
    console.log(`Feedback received: Classification was ${isCorrect ? 'correct' : 'incorrect'}.`);
    toast({
        title: "Feedback Submitted",
        description: "Thank you for helping us improve our AI!",
    })
  };

  const resetScanner = () => {
    stopCamera();
    setStatus('idle');
    setCapturedImage(null);
    setResult(null);
    setUpcyclingIdeas([]);
    setFeedback('unsubmitted');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score > 0.9) return 'text-green-600 dark:text-green-400';
    if (score > 0.7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap />
          Component Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full bg-secondary rounded-lg flex items-center justify-center relative overflow-hidden mb-4">
          {status === 'idle' && (
            <div className="text-center text-muted-foreground p-4">
              <Camera className="mx-auto h-12 w-12 mb-4" />
              <h3 className="font-semibold text-lg text-foreground">
                Ready to Scan
              </h3>
              <p>Use your camera or upload an image to identify a component.</p>
            </div>
          )}
          {status === 'camera_active' && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          {(status === 'loading' || status === 'results') && capturedImage && (
            <Image
              src={capturedImage}
              alt="Captured component"
              layout="fill"
              objectFit="contain"
            />
          )}
          {status === 'loading' && (
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 font-semibold text-lg">Analyzing...</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center mb-6">
          {status === 'idle' && (
            <>
              <Button onClick={handleStartCamera} className="w-full sm:w-auto">
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </>
          )}
           {status === 'camera_active' && (
            <>
              <Button onClick={handleCapture} className="w-full sm:w-auto">
                <Camera className="mr-2 h-4 w-4" />
                Capture
              </Button>
              <Button
                onClick={resetScanner}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>

        {status === 'results' && result && (
          <div className="space-y-6 animate-in fade-in-50">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold font-headline text-center mb-1">
                  {result.componentType}
                </h3>
                 <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">Confidence: <span className={`font-semibold ${getConfidenceColor(result.confidenceScore)}`}>{(result.confidenceScore * 100).toFixed(0)}%</span></p>
                  {result.confidenceScore < 0.7 && (
                     <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Low confidence. Please verify the result.</p>
                  )}
                </div>

                <div className={`p-4 rounded-lg text-center mb-4 ${result.recyclable ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                   {result.recyclable ? (
                     <div className="flex items-center justify-center gap-2">
                        <Recycle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">Upcycling Advised</h4>
                     </div>
                   ) : (
                    <div className="flex items-center justify-center gap-2">
                        <Flame className="h-6 w-6 text-red-600 dark:text-red-400" />
                        <h4 className="text-lg font-semibold text-red-800 dark:text-red-200">Route to EcoBurn</h4>
                    </div>
                   )}
                   {result.hazardFlag && (
                     <div className="flex items-center justify-center gap-2 text-xs text-yellow-800 dark:text-yellow-200 mt-1">
                       <AlertTriangle className="h-4 w-4" />
                       <span>Potential Hazard Detected</span>
                     </div>
                   )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 p-6 pt-0">
                {feedback === 'unsubmitted' ? (
                 <>
                    <p className="text-sm text-muted-foreground">Is this classification correct?</p>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => handleFeedback(true)}>
                            <ThumbsUp className="mr-2 h-4 w-4"/> Yes
                        </Button>
                        <Button variant="outline" onClick={() => handleFeedback(false)}>
                            <ThumbsDown className="mr-2 h-4 w-4"/> No
                        </Button>
                    </div>
                 </>
                ) : (
                    <div className="text-sm text-muted-foreground flex items-center gap-2 p-2 rounded-lg bg-secondary">
                        <CheckCircle2 className="h-4 w-4 text-primary"/>
                        <p>Thank you for your feedback!</p>
                    </div>
                )}
              </CardFooter>
            </Card>

            {result.recyclable && (
                 <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-accent" />
                        Upcycling Ideas
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                    {isIdeasLoading ? (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Finding inspiration...</span>
                        </div>
                    ) : upcyclingIdeas.length > 0 ? (
                        <ul className="space-y-2 list-disc pl-5">
                        {upcyclingIdeas.map((idea, index) => (
                            <li key={index}>{idea}</li>
                        ))}
                        </ul>
                    ) : (
                         <p className="text-sm text-muted-foreground text-center">No upcycling ideas found for this component.</p>
                    )}
                    </CardContent>
                </Card>
            )}

            <Button
              onClick={resetScanner}
              variant="outline"
              className="w-full"
            >
              Scan Another Component
            </Button>
          </div>
        )}
      </CardContent>
      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
}
