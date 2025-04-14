
import React, { useEffect, useState } from 'react';

interface TimerProps {
  onTimeUp: () => void;
  isRunning: boolean;
  resetKey: number;
  duration?: number; // Duration in seconds
}

/**
 * Timer component that counts down from a specified duration.
 * @param onTimeUp - Callback function to be called when the time is up
 * @param isRunning - Boolean indicating if the timer is running
 * @param resetKey - Key to reset the timer
 * @param duration - Duration in seconds (default: 180)
 */
export const Timer: React.FC<TimerProps> = ({ onTimeUp, isRunning, resetKey, duration = 180 }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [resetKey, duration]);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-xl font-bold text-white">
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};
