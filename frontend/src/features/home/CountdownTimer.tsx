import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer() {
  // Set the date to June 1, 2025 (early bird deadline)
  const targetDate = new Date("2025-06-01T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Target date has passed
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({
    value,
    label,
    delay,
  }: {
    value: number;
    label: string;
    delay: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="flex flex-col items-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl">
        {value.toString().padStart(2, "0")}
      </div>
      <span className="mt-2 text-sm text-gray-600">{label}</span>
    </motion.div>
  );

  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-xl font-semibold text-secondary sm:text-2xl">
            Early Bird Registration{" "}
            <span className="text-accent">Ends In:</span>
          </h2>

          <div className="mt-6 flex justify-center space-x-4">
            <TimeUnit value={timeLeft.days} label="Days" delay={0.1} />
            <TimeUnit value={timeLeft.hours} label="Hours" delay={0.2} />
            <TimeUnit value={timeLeft.minutes} label="Minutes" delay={0.3} />
            <TimeUnit value={timeLeft.seconds} label="Seconds" delay={0.4} />
          </div>

          <p className="mt-6 text-gray-600">
            Register before the deadline to save 15% on all courses!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
