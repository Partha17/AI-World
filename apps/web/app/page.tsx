"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Gem, Sparkles } from "lucide-react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=800&q=80",
  "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
  "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
];

export default function AttractScreen() {
  const router = useRouter();

  const handleTouch = () => {
    router.push("/discover");
  };

  return (
    <div
      className="relative h-full w-full cursor-pointer overflow-hidden bg-gradient-to-br from-background via-muted to-background"
      onClick={handleTouch}
    >
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 h-[30vw] w-[30vw] rounded-full bg-secondary/15 blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 h-[35vw] w-[35vw] rounded-full bg-accent/10 blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, 20, -30, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 h-[25vw] w-[25vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[60px]"
        />
      </div>

      {/* Floating jewelry images */}
      <div className="absolute inset-0 pointer-events-none">
        {HERO_IMAGES.map((src, i) => {
          const positions = [
            { top: "8%", left: "10%", size: "140px", delay: 0 },
            { top: "15%", right: "8%", size: "160px", delay: 1 },
            { top: "45%", left: "5%", size: "120px", delay: 2 },
            { top: "55%", right: "12%", size: "150px", delay: 0.5 },
            { bottom: "15%", left: "18%", size: "130px", delay: 1.5 },
            { bottom: "10%", right: "5%", size: "140px", delay: 2.5 },
          ];
          const pos = positions[i];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ delay: pos.delay, duration: 1.5, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                right: pos.right,
                bottom: pos.bottom,
                width: pos.size,
                height: pos.size,
              }}
              className="animate-float rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                style={{ animationDelay: `${pos.delay}s` }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Center content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent shadow-2xl shadow-primary/30"
          >
            <Gem className="h-10 w-10 text-white" />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold font-serif text-foreground mb-4">
            Jewel<span className="text-gradient">AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-2 max-w-md mx-auto">
            Your Personal Jewelry Consultant
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-primary/60 mb-16">
            <Sparkles className="h-4 w-4" />
            <span>Powered by AI</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="animate-pulse-glow"
        >
          <div className="rounded-full border-2 border-primary/30 bg-white/60 backdrop-blur-sm px-10 py-5 shadow-xl">
            <span className="text-lg font-semibold text-primary">
              Touch to Begin
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
