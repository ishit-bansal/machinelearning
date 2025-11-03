import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Car, Heart, Sparkles, Shield } from "lucide-react";

export const RealWorld = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.15 });
  const [activeApp, setActiveApp] = useState<number | null>(null);

  const applications = [
    {
      icon: Car,
      title: "Self-Driving Cars & Smart Maps",
      description: "Machines learn from millions of miles of driving to spot people, bikes, and road signs. They also use machine learning to find the fastest, safest routes on the map. Together, this technology is making roads safer and helping drivers reach destinations efficiently.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Heart,
      title: "Medical Diagnostics",
      description: "AI helps doctors detect cancers, fractures, and diseases faster and earlier. It works 24/7, spotting patterns humans might miss, and can save lives through early detection.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Sparkles,
      title: "Recommendation Systems",
      description: "From Netflix to Spotify, YouTube, TikTok, and Amazon, machines learn what you like by noticing patterns in your choices. They suggest music, movies, videos, and products you might love, connecting you with things you'd never find on your own.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Security & Face Recognition",
      description: "Machines can recognize faces, detect unusual activity, and keep your devices secure. From unlocking your phone to spotting suspicious behavior in cameras, AI is quietly helping protect people and property.",
      color: "from-emerald-500 to-teal-500",
    },
  ];

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
            Where ML is <span className="glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Changing the World
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Not science fiction, this is real impact happening today
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {applications.map((app, idx) => {
            const Icon = app.icon;
            const isActive = activeApp === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onHoverStart={() => setActiveApp(idx)}
                onHoverEnd={() => setActiveApp(null)}
                className="group relative"
              >
                <motion.div
                  className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all flex flex-col justify-center"
                  animate={{
                    borderColor: isActive ? "hsl(var(--primary))" : "hsl(var(--border))",
                    boxShadow: isActive ? "0 0 40px hsl(var(--primary) / 0.3)" : "none",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Gradient background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 transition-opacity`}
                    animate={{ opacity: isActive ? 0.1 : 0 }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                    <motion.div
                        className="inline-block origin-center flex-shrink-0"
                        animate={{ scale: isActive ? 1.15 : 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <div className={`inline-flex rounded-xl bg-gradient-to-br ${app.color} p-3`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>
                      <h3 className="text-2xl font-bold text-foreground">{app.title}</h3>
                    </div>
                    <p className="text-base leading-relaxed text-foreground/90">{app.description}</p>

                    {/* Light up effect */}
                    <motion.div
                      className="mt-4 flex gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 1 : 0 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`h-1 flex-1 rounded-full bg-gradient-to-r ${app.color}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: isActive ? 1 : 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 px-8 py-6">
            <p className="text-lg leading-relaxed">
              <span className="font-bold text-foreground">This is just the beginning.</span> Machine learning is transforming healthcare, climate science, education, manufacturing, and every industry you can imagine. The question isn't whether ML will change the world — it's how we'll guide that change.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
