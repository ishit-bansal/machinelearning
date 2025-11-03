import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle } from "lucide-react";
import wolfImage from "@/assets/wolf.webp";
import femaleEmployeeImage from "@/assets/femaleemployee.png";
import soapDispenserImage from "@/assets/soapdispenser.jpg";

export const MLMistakes = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.15 });

  const mistakes = [
    {
      scenario: "The Wolf Detector",
      image: wolfImage,
      alt: "A grey wolf standing in snow",
      description: "Researchers built a system to tell wolves from dogs.",
      problem: "It worked perfectly, until someone showed it a dog standing in the snow.",
      result: "The machine confidently called it a wolf.",
      explanation: "It had learned that 'snow' meant 'wolf.'",
    },
    {
      scenario: "The Résumé Robot",
      image: femaleEmployeeImage,
      alt: "Female employee working with laptop in office",
      description: "A hiring tool was trained on years of company data.",
      problem: "Because most past hires were men, it quietly started favoring male applicants.",
      result: "The machine wasn't being unfair on purpose, it just copied what it saw.",
      explanation: "",
    },
    {
      scenario: "The Soap Dispenser",
      image: soapDispenserImage,
      alt: "Hand under automatic soap dispenser",
      description: "An automatic soap dispenser worked fine for some users but failed for others.",
      problem: "It didn't detect darker skin because it had only been tested on lighter tones.",
      result: "It wasn't broken, just badly trained.",
      explanation: "",
    },
  ];

  return (
    <section ref={ref} className="section-wrapper bg-gradient-to-b from-transparent via-destructive/5 to-transparent py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-destructive" />
          <h2 className="mb-4 text-5xl font-bold md:text-6xl">
            When Machines <span className="text-destructive">Mess Up</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Even smart machines make silly mistakes.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            They don't really understand the world, they just learn patterns.
          </p>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            And sometimes, those patterns turn out to be wrong.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl space-y-8">
          {mistakes.map((mistake, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="group relative"
            >
              <div className="overflow-hidden rounded-2xl border border-destructive/30 bg-card p-8 transition-all hover:border-destructive/50 hover:shadow-[0_0_30px_hsl(var(--destructive)/0.2)]">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                  {/* Image */}
                  <motion.div
                    className="flex-shrink-0 mx-auto lg:mx-0"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <img
                        src={mistake.image}
                        alt={mistake.alt}
                        className="w-full max-w-sm rounded-xl object-cover shadow-lg lg:w-80 lg:h-64"
                      />
                      <motion.div
                        className="absolute -right-4 -top-4 rounded-full bg-destructive px-3 py-1 text-sm font-bold text-white shadow-lg"
                        animate={{ rotate: [-5, 5, -5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ✗
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
                    <h3 className="mb-4 text-3xl font-bold">{mistake.scenario}</h3>
                    
                    <div className="space-y-4">
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        {mistake.description}
                      </p>

                      <p className="text-lg leading-relaxed text-foreground">
                        {mistake.problem}
                      </p>

                      <p className="text-lg font-semibold leading-relaxed text-destructive">
                        {mistake.result}
                      </p>

                      {mistake.explanation && (
                        <p className="text-lg italic leading-relaxed text-muted-foreground">
                          {mistake.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="mx-auto max-w-2xl rounded-2xl border border-primary/30 bg-card p-8">
            <h3 className="mb-4 text-2xl font-bold text-foreground">The Lesson</h3>
            <p className="mb-3 text-lg leading-relaxed text-muted-foreground">
              Machines don't have judgment, fairness, or context.
            </p>
            <p className="mb-3 text-lg leading-relaxed text-muted-foreground">
              They simply learn from whatever examples we give them.
            </p>
            <p className="mb-3 text-lg leading-relaxed text-muted-foreground">
              If our data is limited or biased, their "intelligence" will be too.
            </p>
            <p className="text-lg font-semibold leading-relaxed text-primary">
              Better examples make better machines.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
