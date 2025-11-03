import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Sparkles } from "lucide-react";

export const MagicOfPatterns = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.15 });
  const [hoveredDigit, setHoveredDigit] = useState<number | null>(null);

  const digits = [
    { number: "0", pattern: [[0,1,1,0], [1,0,0,1], [1,0,0,1], [1,0,0,1], [0,1,1,0]], hint: "Round shapes → maybe a 0" },
    { number: "9", pattern: [[0,1,1,0], [1,0,0,1], [0,1,1,1], [0,0,0,1], [0,1,1,0]], hint: "Long line with a loop → probably a 9" },
    { number: "8", pattern: [[0,1,1,0], [1,0,0,1], [0,1,1,0], [1,0,0,1], [0,1,1,0]], hint: "Two loops stacked → aha, 8!" },
  ];

  return (
    <section ref={ref} className="section-wrapper bg-gradient-to-b from-transparent via-primary/5 to-transparent py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <Sparkles className="mx-auto mb-4 h-16 w-16 animate-pulse-glow text-accent" />
          <h2 className="mb-4 text-5xl font-bold md:text-6xl">
            A Tiny Bit of <span className="glow-text text-accent">Magic</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            How patterns in data teach machines to recognize anything
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-3xl border border-accent/30 bg-card/50 p-8 backdrop-blur-sm md:p-12"
        >
          <div className="flex flex-wrap items-center justify-center gap-8">
              {digits.map((digit, idx) => (
                <motion.div
                  key={idx}
                  className="relative"
                  onHoverStart={() => setHoveredDigit(idx)}
                  onHoverEnd={() => setHoveredDigit(null)}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="rounded-2xl border border-muted bg-background p-6">
                    <div className="mb-4 grid grid-cols-4 gap-1.5 w-fit mx-auto">
                      {digit.pattern.map((row, rowIdx) =>
                        row.map((cell, cellIdx) => (
                          <motion.div
                            key={`${rowIdx}-${cellIdx}`}
                            className="aspect-square h-10 w-10 rounded"
                            animate={{
                              backgroundColor: cell 
                                ? hoveredDigit === idx 
                                  ? "hsl(var(--accent))" 
                                  : "hsl(var(--primary))"
                                : "hsl(var(--muted))",
                              boxShadow: cell && hoveredDigit === idx
                                ? "0 0 15px hsl(var(--accent))"
                                : "none",
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        ))
                      )}
                    </div>
                    
                    <div className="flex items-center justify-center gap-3">
                      <motion.div
                        className="flex gap-1"
                        animate={{ opacity: hoveredDigit === idx ? [0.3, 1, 0.3] : 0.3 }}
                        transition={{ duration: 1, repeat: hoveredDigit === idx ? Infinity : 0 }}
                      >
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-2 w-2 rounded-full bg-accent" />
                        ))}
                      </motion.div>
                      
                      <motion.div
                        className="rounded-lg bg-gradient-to-r from-accent/20 to-accent/30 px-6 py-3 text-2xl font-bold"
                        animate={{
                          scale: hoveredDigit === idx ? [1, 1.1, 1] : 1,
                          textShadow: hoveredDigit === idx 
                            ? "0 0 20px hsl(var(--accent))"
                            : "none",
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {digit.number}
                      </motion.div>
                    </div>
                    
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      {digit.hint}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1 }}
              className="mt-12 text-center"
            >
              <div className="mx-auto inline-block rounded-2xl border border-accent/30 bg-accent/10 px-6 py-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  After seeing thousands of examples, the machine starts to understand,
                  it finally knows what makes a "3" look like a "3"
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
