import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Sparkles } from "lucide-react";
import robotImage from "@/assets/robot.png";
import pencilCursor from "@/assets/pencil.png";
import * as tf from '@tensorflow/tfjs';

export const DigitRecognizer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);

  // Load TensorFlow.js model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        const loadedModel = await tf.loadLayersModel('/model/model.json');
        
        const testInput = tf.zeros([1, 28, 28]);
        const testOutput = loadedModel.predict(testInput) as tf.Tensor;
        await testOutput.data();
        testInput.dispose();
        testOutput.dispose();
        
        setModel(loadedModel);
        setIsModelLoading(false);
      } catch (error: any) {
        console.error('Error loading model:', error);
        setIsModelLoading(false);
      }
    };
    
    loadModel();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1a1625";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const preprocessCanvas = (canvas: HTMLCanvasElement): tf.Tensor => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('No canvas context');
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const bgColor = { r: 26, g: 22, b: 37 };
    
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
    let hasDrawing = false;
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const r = imageData.data[idx];
        const g = imageData.data[idx + 1];
        const b = imageData.data[idx + 2];
        const a = imageData.data[idx + 3];
        
        const dist = Math.sqrt(
          Math.pow(r - bgColor.r, 2) + 
          Math.pow(g - bgColor.g, 2) + 
          Math.pow(b - bgColor.b, 2)
        );
        
        if (dist > 40 && a > 128) {
          hasDrawing = true;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }
    
    if (!hasDrawing) {
      return tf.zeros([1, 28, 28]);
    }
    
    const padding = Math.max(maxX - minX, maxY - minY) * 0.2;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(canvas.width, maxX + padding);
    maxY = Math.min(canvas.height, maxY + padding);
    
    const digitWidth = maxX - minX;
    const digitHeight = maxY - minY;
    
    const extractCanvas = document.createElement('canvas');
    extractCanvas.width = digitWidth;
    extractCanvas.height = digitHeight;
    const extractCtx = extractCanvas.getContext('2d');
    if (!extractCtx) throw new Error('No extract canvas context');
    
    extractCtx.fillStyle = '#000000';
    extractCtx.fillRect(0, 0, digitWidth, digitHeight);
    extractCtx.drawImage(canvas, minX, minY, digitWidth, digitHeight, 0, 0, digitWidth, digitHeight);
    
    const extractImageData = extractCtx.getImageData(0, 0, digitWidth, digitHeight);
    for (let i = 0; i < extractImageData.data.length; i += 4) {
      const r = extractImageData.data[i];
      const g = extractImageData.data[i + 1];
      const b = extractImageData.data[i + 2];
      const a = extractImageData.data[i + 3];
      
      const dist = Math.sqrt(
        Math.pow(r - bgColor.r, 2) + 
        Math.pow(g - bgColor.g, 2) + 
        Math.pow(b - bgColor.b, 2)
      );
      
      if (dist > 40 && a > 128) {
        extractImageData.data[i] = 255;
        extractImageData.data[i + 1] = 255;
        extractImageData.data[i + 2] = 255;
        extractImageData.data[i + 3] = 255;
      } else {
        extractImageData.data[i] = 0;
        extractImageData.data[i + 1] = 0;
        extractImageData.data[i + 2] = 0;
        extractImageData.data[i + 3] = 255;
      }
    }
    extractCtx.putImageData(extractImageData, 0, 0);
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) throw new Error('No temp canvas context');
    
    tempCtx.fillStyle = '#000000';
    tempCtx.fillRect(0, 0, 28, 28);
    
    const margin = 2;
    const scale = Math.min(24 / digitWidth, 24 / digitHeight);
    const scaledWidth = digitWidth * scale;
    const scaledHeight = digitHeight * scale;
    const destX = (28 - scaledWidth) / 2;
    const destY = (28 - scaledHeight) / 2;
    
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    tempCtx.drawImage(extractCanvas, destX, destY, scaledWidth, scaledHeight);
    
    const finalImageData = tempCtx.getImageData(0, 0, 28, 28);
    const data = new Float32Array(28 * 28);
    
    for (let i = 0; i < 28 * 28; i++) {
      const idx = i * 4;
      const gray = finalImageData.data[idx];
      data[i] = gray / 255.0;
    }
    
    let minVal = 1.0, maxVal = 0.0;
    for (let i = 0; i < 28 * 28; i++) {
      if (data[i] > 0.05) {
        minVal = Math.min(minVal, data[i]);
        maxVal = Math.max(maxVal, data[i]);
      }
    }
    
    if (maxVal > minVal && maxVal > 0.1) {
      const range = maxVal - minVal;
      for (let i = 0; i < 28 * 28; i++) {
        if (data[i] > 0.05) {
          data[i] = (data[i] - minVal) / range;
          data[i] = Math.min(data[i], 1.0);
        } else {
          data[i] = 0.0;
        }
      }
    }
    
    return tf.tensor3d(data, [1, 28, 28]);
  };

  const stopDrawing = async () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas || !model) return;
    
    try {
      // Preprocess canvas to 28x28 MNIST format
      const tensor = preprocessCanvas(canvas);
      
      // Make prediction
      const predictions = model.predict(tensor) as tf.Tensor;
      const predArray = await predictions.data();
      
      const predictionArray = Array.from(predArray);
      const maxProb = Math.max(...predictionArray);
      const predictedDigit = predictionArray.indexOf(maxProb);
      
      setPrediction(predictedDigit);
      setConfidence(maxProb * 100);
      
      // Clean up tensors to prevent memory leaks
      tensor.dispose();
      predictions.dispose();
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1a1625";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setPrediction(null);
      setConfidence(0);
    }
  };

  return (
    <section ref={ref} className="section-wrapper py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <Sparkles className="mx-auto mb-4 h-16 w-16 animate-pulse text-primary" />
          <h2 className="mb-4 text-5xl font-bold md:text-6xl">
            Try It <span className="glow-text text-primary">Yourself!</span>
          </h2>
          <p className="mx-auto max-w-5xl text-base md:text-lg lg:text-xl text-muted-foreground">
            Draw a number and watch a bit of machine learning magic happen (hopefully 🤞)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-4xl"
        >
          <div className="overflow-hidden rounded-3xl border border-primary/30 bg-card p-8 shadow-[0_0_50px_hsl(var(--primary)/0.1)]">
            <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-stretch">
              {/* Canvas */}
              <div className="flex flex-col h-full">
                <div className="mb-4 text-center text-sm text-muted-foreground">
                  Draw a digit (0–9) below!
                </div>
                
                <div 
                  className="relative flex-1 min-h-[400px] overflow-hidden rounded-2xl border-2 border-primary/50"
                  style={{ 
                    cursor: `url(${pencilCursor}) 2 2, auto`
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className="w-full h-full touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const mouseEvent = new MouseEvent("mousedown", {
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                      });
                      canvasRef.current?.dispatchEvent(mouseEvent);
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const mouseEvent = new MouseEvent("mousemove", {
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                      });
                      canvasRef.current?.dispatchEvent(mouseEvent);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      const mouseEvent = new MouseEvent("mouseup");
                      canvasRef.current?.dispatchEvent(mouseEvent);
                    }}
                  />
                  
                  {/* Neural visualization overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-2 w-2 rounded-full bg-primary"
                        style={{
                          left: `${10 + i * 15}%`,
                          top: `${20 + Math.sin(i) * 30}%`,
                        }}
                        animate={{
                          opacity: prediction !== null ? [0.3, 1, 0.3] : 0.3,
                          scale: prediction !== null ? [1, 1.5, 1] : 1,
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-center gap-4">
                  <Button
                    onClick={clearCanvas}
                    variant="outline"
                    className="gap-2"
                  >
                    <Eraser className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>

              {/* Prediction display */}
              <div className="flex flex-col h-full">
                <div className="relative flex flex-col flex-1 min-h-[400px] rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6 overflow-hidden">
                  {prediction !== null ? (
                    <motion.div
                      className="relative z-10 flex flex-col h-full"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        duration: 0.6
                      }}
                    >
                      {/* Robot at the top */}
                      <motion.div
                        className="flex justify-center mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.img
                          src={robotImage}
                          alt="robot"
                          className="h-20 w-20 object-contain"
                          animate={{ 
                            scale: [1, 1.08, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{ 
                            duration: 2,
                            delay: 0.4,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                        />
                      </motion.div>

                      {/* Speech bubble with prediction */}
                      <motion.div
                        className="relative bg-card/80 backdrop-blur-sm border-2 border-primary/50 rounded-2xl p-6 shadow-xl mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        {/* Speech bubble tail pointing up to robot */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-primary/50"></div>
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-card/80"></div>
                        
                        <div className="text-center">
                          <p className="text-lg font-medium text-muted-foreground mb-2">
                            I think it's a
                          </p>
                          
                          {/* Glowing prediction number */}
                          <motion.div
                            className="relative inline-block"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                              type: "spring",
                              stiffness: 150,
                              damping: 12,
                              delay: 0.4
                            }}
                          >
                            {/* Glow effect */}
                            <motion.div
                              className="absolute inset-0 blur-3xl"
                              animate={{
                                opacity: [0.4, 0.7, 0.4],
                                scale: [0.9, 1.2, 0.9],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              style={{
                                background: `radial-gradient(circle, hsl(var(--primary)), transparent)`,
                              }}
                            />
                            <div className="relative text-9xl font-bold text-primary glow-text drop-shadow-2xl leading-none">
                              {prediction}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Confidence bar */}
                      <motion.div
                        className="mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="relative h-3 overflow-hidden rounded-full bg-primary/20 shadow-inner">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${confidence}%` }}
                            transition={{ 
                              duration: 0.8,
                              delay: 0.6,
                              type: "spring",
                              stiffness: 100
                            }}
                            className="relative h-full rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg"
                          >
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              animate={{
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                              }}
                              style={{
                                background: `linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))`,
                                filter: 'blur(4px)'
                              }}
                            />
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Confidence text */}
                      <motion.div
                        className="text-center mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <p className="text-base font-semibold text-muted-foreground">
                          ({confidence.toFixed(0)}% sure)
                        </p>
                      </motion.div>

                      {/* Particle rain animation - fills remaining space */}
                      <div className="relative flex-1 w-full overflow-hidden -mb-6">
                        {[...Array(25)].map((_, i) => {
                          const startX = 10 + (i * 3.2); // Centered distribution
                          const speed = 3.5 + Math.random() * 2;
                          const delay = Math.random() * 2;
                          
                          return (
                            <motion.div
                              key={i}
                              className="absolute"
                              style={{ left: `${startX}%`, top: 0 }}
                              initial={{ y: 0, opacity: 0 }}
                              animate={{
                                y: '100%',
                                opacity: [0, 0.2, 0.5, 0.7, 0.8, 0.7, 0.5, 0],
                              }}
                              transition={{
                                duration: speed,
                                delay: delay,
                                repeat: Infinity,
                                repeatDelay: Math.random() * 0.3,
                                ease: "linear",
                              }}
                            >
                              <div className="w-1 h-6 bg-gradient-to-b from-primary/80 via-primary/60 to-transparent rounded-full blur-[1px]" />
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="text-center flex-1 flex flex-col justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="text-6xl mb-4"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity
                        }}
                      >
                        ✨
                      </motion.div>
                      <div className="text-xl text-muted-foreground">
                        Draw to predict
                      </div>
                    </motion.div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
