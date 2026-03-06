"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseInactivityTimerOptions {
  idleTimeout: number;
  warningDuration: number;
  onIdle: () => void;
  enabled?: boolean;
}

export function useInactivityTimer({
  idleTimeout,
  warningDuration,
  onIdle,
  enabled = true,
}: UseInactivityTimerOptions) {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(warningDuration);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownValueRef = useRef(warningDuration);

  const clearAllTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    idleTimerRef.current = null;
    countdownRef.current = null;
  }, []);

  const resetTimer = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);
    setCountdown(warningDuration);
    countdownValueRef.current = warningDuration;

    if (!enabled) return;

    idleTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      countdownValueRef.current = warningDuration;
      setCountdown(warningDuration);

      countdownRef.current = setInterval(() => {
        countdownValueRef.current -= 1;
        setCountdown(countdownValueRef.current);
        if (countdownValueRef.current <= 0) {
          clearAllTimers();
          setShowWarning(false);
          onIdle();
        }
      }, 1000);
    }, idleTimeout);
  }, [idleTimeout, warningDuration, onIdle, enabled, clearAllTimers]);

  useEffect(() => {
    if (!enabled) {
      clearAllTimers();
      setShowWarning(false);
      return;
    }

    const events = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart"];
    const handleActivity = () => {
      if (!countdownRef.current) {
        resetTimer();
      }
    };

    events.forEach((e) => document.addEventListener(e, handleActivity, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => document.removeEventListener(e, handleActivity));
      clearAllTimers();
    };
  }, [enabled, resetTimer, clearAllTimers]);

  const dismissWarning = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  return { showWarning, countdown, dismissWarning };
}
