import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import robotImage from "@/assets/robot.png";
import humanBoyImage from "@/assets/human-boy.png";

const HEART_SCALE = 26;
const NUM_DIGITS = 200;
const FORMATION_DURATION = 2.5;
const REVOLUTION_DURATION = 90;

type HeartPoint = {
  x: number;
  y: number;
  gradient: number;
};

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const computeHeartPoint = (t: number) => {
  const x = HEART_SCALE * 16 * Math.pow(Math.sin(t), 3);
  const y =
    -HEART_SCALE *
    (13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t));
  return { x, y };
};

const getColor = (progress: number) => {
  const t = clamp(progress);
  const warm = { r: 251, g: 146, b: 60 };
  const cool = { r: 34, g: 211, b: 238 };
  return `rgb(${Math.round(lerp(warm.r, cool.r, t))}, ${Math.round(
    lerp(warm.g, cool.g, t)
  )}, ${Math.round(lerp(warm.b, cool.b, t))})`;
};

const generateHeartPoints = (): HeartPoint[] => {
  const points: HeartPoint[] = [];
  const numPoints = 500;
  for (let i = 0; i < numPoints; i++) {
    const t = (i / numPoints) * Math.PI * 2;
    const { x, y } = computeHeartPoint(t);
    const gradient = clamp((x + 350) / 700);
    points.push({ x, y, gradient });
  }
  return points;
};

const Digit = ({
  index,
  heartPoints,
  totalDigits,
  started,
}: {
  index: number;
  heartPoints: HeartPoint[];
  totalDigits: number;
  started: boolean;
}) => {
  const progress = useMotionValue(0);
  const startX = -380;
  const startY = -280;

  const heartIndex = Math.floor((index / totalDigits) * heartPoints.length);
  const targetPoint = heartPoints[heartIndex];
  const controlX = (startX + targetPoint.x) / 2;
  const controlY = (startY + targetPoint.y) / 2 - 100;

  const x = useTransform(progress, (v) => {
    if (v <= 1) {
      const t = v;
      return (
        (1 - t) * (1 - t) * startX +
        2 * (1 - t) * t * controlX +
        t * t * targetPoint.x
      );
    } else {
      const revProgress = v - 1;
      const startHeartIndex = heartIndex;
      const currentPosition =
        (startHeartIndex + revProgress * heartPoints.length) %
        heartPoints.length;
      const idx = Math.floor(currentPosition);
      const nextIdx = (idx + 1) % heartPoints.length;
      const localT = currentPosition - idx;
      return lerp(heartPoints[idx].x, heartPoints[nextIdx].x, localT);
    }
  });

  const y = useTransform(progress, (v) => {
    if (v <= 1) {
      const t = v;
      return (
        (1 - t) * (1 - t) * startY +
        2 * (1 - t) * t * controlY +
        t * t * targetPoint.y
      );
    } else {
      const revProgress = v - 1;
      const startHeartIndex = heartIndex;
      const currentPosition =
        (startHeartIndex + revProgress * heartPoints.length) %
        heartPoints.length;
      const idx = Math.floor(currentPosition);
      const nextIdx = (idx + 1) % heartPoints.length;
      const localT = currentPosition - idx;
      return lerp(heartPoints[idx].y, heartPoints[nextIdx].y, localT);
    }
  });

  const opacity = useTransform(progress, (v) => (v <= 1 ? v : 1));
  const scale = useTransform(progress, (v) => (v <= 1 ? lerp(0.3, 1, v) : 1));

  useEffect(() => {
    if (!started) return;

    const delay = (index / totalDigits) * FORMATION_DURATION * 1000;
    const individualFormationTime = FORMATION_DURATION * 0.6;

    const normalizedIndex = index / totalDigits;
    const catchUpFactor = 0.3;
    const initialSpeedMultiplier =
      1 - catchUpFactor + normalizedIndex * catchUpFactor * 2;

    const fullRevolutionSeconds = REVOLUTION_DURATION;
    const firstRevolutionDuration =
      fullRevolutionSeconds / initialSpeedMultiplier;

    const blendStartFraction = 0.045;
    const blendDurationFraction = 0;

    const timer = setTimeout(() => {
      animate(progress, 1, {
        duration: individualFormationTime,
        ease: [0.22, 1, 0.36, 1],
      }).then(() => {
        progress.set(1);
        const revolutionAnim = animate(progress, 2, {
          duration: firstRevolutionDuration,
          ease: "linear",
        });

        const blendStartDelay = blendStartFraction * firstRevolutionDuration * 1000;
        setTimeout(() => {
          const blendDurationMs = blendDurationFraction * fullRevolutionSeconds * 1000;
          const blendStartTime = Date.now();

          const blendInterval = setInterval(() => {
            const elapsed = Date.now() - blendStartTime;
            const t = Math.min(elapsed / blendDurationMs, 1);
            const currentSpeed =
              initialSpeedMultiplier + (1 - initialSpeedMultiplier) * t;

            revolutionAnim.stop();
            animate(progress, 2, {
              duration: fullRevolutionSeconds / currentSpeed,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            });

            if (t >= 1) clearInterval(blendInterval);
          }, 100);
        }, blendStartDelay);
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [started, progress, index, totalDigits]);

  const getDigitColor = () => {
    const val = progress.get();
    if (val <= 1) {
      return getColor(targetPoint.gradient);
    } else {
      const revProgress = val - 1;
      const startHeartIndex = heartIndex;
      const currentPosition =
        (startHeartIndex + revProgress * heartPoints.length) %
        heartPoints.length;
      const idx = Math.floor(currentPosition) % heartPoints.length;
      return getColor(heartPoints[idx].gradient);
    }
  };

  const [color, setColor] = useState(getColor(targetPoint.gradient));
  useEffect(() => {
    const unsubscribe = progress.on("change", () => setColor(getDigitColor()));
    return unsubscribe;
  }, [progress]);

  return (
    <motion.div
      className="absolute text-xs font-mono font-bold pointer-events-none"
      style={{
        x,
        y,
        opacity,
        scale,
        color,
        textShadow: `0 0 8px ${color}80`,
      }}
    >
      {index % 2 === 0 ? "1" : "0"}
    </motion.div>
  );
};

export const HumansAndMachines = () => {
  const heartPoints = useRef(generateHeartPoints()).current;
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    if (inView) setAnimationStarted(true);
  }, [inView]);

  return (
    <section ref={sectionRef} className="relative w-full bg-background pt-16 sm:pt-20 pb-12 sm:pb-16">
      <div className="container flex flex-col items-center gap-12 md:gap-16">
        {/* Heading */}
        <motion.div
          className="text-center mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            <span className="text-foreground">Better </span>
            <span className="text-primary glow-text">Together</span>
          </h2>
        </motion.div>

        <div className="flex w-full flex-col items-center gap-10 md:flex-row md:items-center md:justify-between">
          {/* Human */}
          <motion.div 
            className="flex flex-col items-center justify-center gap-4 text-center md:w-1/3 md:items-start md:text-left md:self-center"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.img
              src={humanBoyImage}
              alt="Human"
              className="h-40 w-40 object-contain"
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <p className="max-w-xs text-base font-medium text-foreground md:text-lg text-center md:text-left">
              <span className="text-orange-400 font-semibold">Humans</span> are{" "}
              <span className="text-primary font-semibold">amazing</span> at{" "}
              <span className="text-purple-400 font-medium">asking why</span>,{" "}
              <span className="text-cyan-400 font-medium">imagining new things</span>, and{" "}
              <span className="text-orange-400 font-medium">caring about what matters</span>.
            </p>
          </motion.div>

          {/* Heart with digits */}
          <motion.div 
            className="relative flex w-full max-w-4xl flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="relative h-[500px] w-full max-w-3xl sm:h-[600px] md:h-[700px]">
              <div
                className="absolute left-1/2 top-1/2 h-[1px] w-[1px] z-0"
                style={{ transform: "translate(-50%, -50%)" }}
              >
                {[...Array(NUM_DIGITS)].map((_, i) => (
                  <Digit
                    key={i}
                    index={i}
                    heartPoints={heartPoints}
                    totalDigits={NUM_DIGITS}
                    started={animationStarted}
                  />
                ))}
              </div>

              {/* Center text */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none text-center px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <p className="max-w-md text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground leading-relaxed">
                  The future isn&apos;t humans{" "}
                  <span className="text-red-400 line-through">OR</span>{" "}
                  machines. It&apos;s{" "}
                  <span className="text-primary font-extrabold">humans AND machines</span>, each doing what they do best, creating things{" "}
                  <span className="text-purple-400 font-semibold underline decoration-2">neither could alone</span>.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Machine */}
          <motion.div 
            className="flex flex-col items-center justify-center gap-4 text-center md:w-1/3 md:items-end md:text-right md:self-center"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.img
              src={robotImage}
              alt="Machine"
              className="h-40 w-40 object-contain"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <p className="max-w-xs text-base font-medium text-foreground md:text-lg text-center md:text-right">
              <span className="text-cyan-400 font-semibold">Machines</span> are{" "}
              <span className="text-primary font-semibold">amazing</span> at{" "}
              <span className="text-emerald-400 font-medium">spotting patterns</span>,{" "}
              <span className="text-purple-400 font-medium">remembering details</span>, and{" "}
              <span className="text-blue-400 font-medium">learning fast</span>.
            </p>
          </motion.div>
        </div>

        {/* Bottom text - centered with heart */}
        <motion.div 
          className="w-full max-w-3xl mx-auto mt-24 mb-4 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-foreground leading-snug mb-4">
            Everything starts with{" "}
            <span className="text-orange-400 font-bold">curiosity</span>
          </p>
          <motion.p 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <span className="text-purple-400">Stay curious</span>
            <span className="text-foreground">, my friend</span>{" "}
            <motion.span
              className="inline-block text-2xl sm:text-3xl md:text-4xl"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              ✨
            </motion.span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};