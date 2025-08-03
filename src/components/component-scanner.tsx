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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { runClassification } from '@/app/dashboard/scan/actions';
import type { ClassifyComponentOutput } from '@/ai/flows/classify-component';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import Image from 'next/image';
import { generateUpcyclingIdeas } from '@/ai/flows/generate-upcycling-ideas';

type Status = 'idle' | 'camera_active' | 'loading' | 'results';
type AIResult = ClassifyComponentOutput & { error?: undefined };
type AIError = { error: string };

export function ComponentScanner() {
  const [status, setStatus] = useState<Status>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<AIResult | null>(null);
  const [upcyclingIdeas, setUpcyclingIdeas] = useState<string[]>([]);
  const [isIdeasLoading, setIdeasLoading] = useState(false);
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

  const handleStopCamera = () => {
    stopCamera();
    setStatus('idle');
    setCapturedImage(null);
    setResult(null);
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
        setCapturedImage(dataUrl);
        stopCamera();
        setStatus('loading');
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
        }
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
          setCapturedImage(dataUrl);
          stopCamera();
          setStatus('loading');
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
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateIdeas = async () => {
    if (result) {
      setIdeasLoading(true);
      setUpcyclingIdeas([]);
      try {
        const response = await generateUpcyclingIdeas({
          componentType: result.componentType,
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

  const resetScanner = () => {
    handleStopCamera();
  };

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
                onClick={handleStopCamera}
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
                <h3 className="text-2xl font-bold font-headline text-center mb-4">
                  {result.componentType}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                  <div
                    className={`p-4 rounded-lg flex flex-col items-center justify-center gap-2 ${
                      result.recyclable
                        ? 'bg-green-100 dark:bg-green-900/50'
                        : 'bg-red-100 dark:bg-red-900/50'
                    }`}
                  >
                    {result.recyclable ? (
                      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    )}
                    <span
                      className={`font-semibold ${
                        result.recyclable
                          ? 'text-green-800 dark:text-green-200'
                          : 'text-red-800 dark:text-red-200'
                      }`}
                    >
                      {result.recyclable ? 'Recyclable' : 'Non-Recyclable'}
                    </span>
                  </div>
                  <div
                    className={`p-4 rounded-lg flex flex-col items-center justify-center gap-2 ${
                      result.hazardFlag
                        ? 'bg-yellow-100 dark:bg-yellow-900/50'
                        : 'bg-gray-100 dark:bg-gray-700/50'
                    }`}
                  >
                    {result.hazardFlag ? (
                      <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    ) : (
                      <CheckCircle2 className="h-8 w-8 text-gray-500" />
                    )}
                    <span
                      className={`font-semibold ${
                        result.hazardFlag
                          ? 'text-yellow-800 dark:text-yellow-200'
                          : 'text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {result.hazardFlag ? 'Hazardous' : 'Non-Hazardous'}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium">Confidence</label>
                  <Progress
                    value={result.confidenceScore * 100}
                    className="mt-1"
                  />
                  <p className="text-right text-sm text-muted-foreground mt-1">
                    {(result.confidenceScore * 100).toFixed(0)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-accent" />
                  Upcycling Ideas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcyclingIdeas.length > 0 ? (
                  <ul className="space-y-2 list-disc pl-5">
                    {upcyclingIdeas.map((idea, index) => (
                      <li key={index}>{idea}</li>
                    ))}
                  </ul>
                ) : (
                  <Button
                    onClick={handleGenerateIdeas}
                    disabled={isIdeasLoading}
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    {isIdeasLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Creative Ideas
                  </Button>
                )}
                {isIdeasLoading && (
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Finding inspiration...
                  </p>
                )}
              </CardContent>
            </Card>

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
