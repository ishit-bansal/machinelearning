import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Brain } from "lucide-react";
import cat0 from "@/assets/cat0.png";
import cat1 from "@/assets/cat1.png";
import cat2 from "@/assets/cat2.png";
import dog1 from "@/assets/dog1.png";
import dog2 from "@/assets/dog2.png";
import dog3 from "@/assets/dog3.png";

export const WhatIsML = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="section-wrapper py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-5xl font-bold md:text-6xl">
            What Even <span className="glow-text text-primary">Is</span> Machine Learning?
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            The difference between traditional coding and AI that learns
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Traditional Programming */}
          <motion.div
            initial={{ opacity: 0.3, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0.3, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:border-destructive hover:shadow-[0_0_40px_hsl(var(--destructive)/0.4)] hover:scale-[1.02] hover:-translate-y-2 flex flex-col"
          >
            <div className="absolute right-0 top-0 h-40 w-40 bg-gradient-to-br from-destructive/20 to-transparent blur-3xl" />
            
            <div className="flex flex-col items-center mb-6">
              <Code2 className="mb-4 h-12 w-12 text-destructive" />
              <h3 className="mb-4 text-2xl font-bold">Traditional Coding</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Programmers write explicit rules for every scenario
              </p>
            </div>

            <div className="space-y-2 text-sm mx-auto max-w-md w-full flex-1">
              <div className="rounded-lg bg-muted p-3 border-l-4 border-destructive/50">
                If pointy ears → maybe cat
              </div>
              <div className="rounded-lg bg-muted p-3 border-l-4 border-destructive/50">
                If tongue out → probably dog
              </div>
              <div className="rounded-lg bg-muted p-3 border-l-4 border-destructive/50">
                If chaos → definitely cat
              </div>
              <div className="rounded-lg bg-muted p-3 border-l-4 border-destructive/50">
                If barks → probably dog
              </div>
              <div className="rounded-lg bg-muted p-3 border-l-4 border-destructive/50">
                If fetches newspaper → good dog
              </div>
              <div className="rounded-lg bg-muted p-3 border-l-4 border-destructive/50">
                If fetches random dead bird → proud cat
              </div>
              <div className="rounded-lg bg-muted p-3 border-l-4 border-destructive/50">
                If digs holes → obvious dog behavior
              </div>
              <div className="rounded-lg bg-muted p-3 border-l-4 border-destructive/50">
                If demands attention then ignores you → elite cat move
              </div>
              <div className="rounded-lg bg-muted p-3 border-l-4 border-destructive/50 opacity-40">
                ...[endless rules]
              </div>
            </div>

            <motion.div
              className="mt-4 rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm font-semibold text-destructive mx-auto max-w-md w-full"
              animate={{ 
                borderColor: ["hsl(var(--destructive) / 0.3)", "hsl(var(--destructive) / 0.6)", "hsl(var(--destructive) / 0.3)"],
                boxShadow: ["0 0 0px hsl(var(--destructive) / 0)", "0 0 20px hsl(var(--destructive) / 0.3)", "0 0 0px hsl(var(--destructive) / 0)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚠️ Manual rules for every scenario, impossible to scale
            </motion.div>
          </motion.div>

          {/* Machine Learning */}
          <motion.div
            initial={{ opacity: 0.3, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 30 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-2xl border border-primary/50 bg-card p-8 transition-all duration-500 hover:border-primary hover:shadow-[0_0_50px_hsl(var(--primary)/0.5)] hover:scale-[1.02] hover:-translate-y-2 flex flex-col"
          >
            <div className="absolute right-0 top-0 h-40 w-40 bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
            
            <div className="flex flex-col items-center mb-6">
              <Brain className="neural-glow mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-4 text-2xl font-bold">Machine Learning</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Show examples, let the AI discover patterns
              </p>
            </div>

            {/* Neural network visualization with image feeding */}
            <div className="space-y-8 mx-auto max-w-xl flex-1">
              {/* Input images flowing into network */}
              <div className="flex items-center justify-center gap-6">
                <div className="space-y-3">
                  {[cat0, cat1, cat2].map((catImg, i) => (
                    <div
                      key={i}
                      className="relative h-16 w-16 rounded-lg overflow-hidden border-2 border-primary/40"
                    >
                      <img 
                        src={catImg} 
                        alt={`Cat ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Simplified arrow */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gradient-to-r from-primary/40 via-primary/60 to-primary/40" />
                </div>

                {/* Output label */}
                <div className="rounded-xl bg-primary/10 border border-primary/50 px-6 py-3 font-bold text-primary">
                  Cat! 🐱
                </div>
              </div>

              {/* Second example with dogs */}
              <div className="flex items-center justify-center gap-6">
                <div className="space-y-3">
                  {[dog1, dog2, dog3].map((dogImg, i) => (
                    <div
                      key={i}
                      className="relative h-16 w-16 rounded-lg overflow-hidden border-2 border-secondary/40"
                    >
                      <img 
                        src={dogImg} 
                        alt={`Dog ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Simplified arrow */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gradient-to-r from-secondary/40 via-secondary/60 to-secondary/40" />
                </div>

                <div className="rounded-xl bg-secondary/10 border border-secondary/50 px-6 py-3 font-bold text-secondary">
                  Dog! 🐶
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-primary/10 border border-primary/40 p-3 text-sm font-semibold text-primary mx-auto max-w-xl w-full text-center">
              ✨ Learns patterns automatically from examples!
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
