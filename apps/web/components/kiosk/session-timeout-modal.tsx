"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SessionTimeoutModalProps {
  show: boolean;
  countdown: number;
  onDismiss: () => void;
}

export function SessionTimeoutModal({ show, countdown, onDismiss }: SessionTimeoutModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-6 w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
          >
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <span className="text-3xl font-bold text-primary font-serif">{countdown}</span>
            </div>
            <h2 className="mb-2 text-xl font-bold font-serif text-foreground">
              Still browsing?
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              This session will reset in {countdown} seconds
            </p>
            <button
              onClick={onDismiss}
              className="w-full rounded-2xl bg-primary py-4 text-base font-semibold text-white active:bg-primary-dark transition-colors touch-target"
            >
              Yes, I&apos;m still here
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
