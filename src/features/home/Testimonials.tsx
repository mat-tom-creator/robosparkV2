import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      content:
        "My daughter loved every minute of the RoboSpark program! She went from having zero coding experience to building and programming her own robot. The instructors were patient and enthusiastic, making complex concepts easy to understand.",
      name: "Sarah Johnson",
      role: "Parent of Emma, 9",
      avatar: "https://via.placeholder.com/96",
    },
    {
      id: 2,
      content:
        "As a tech professional, I was impressed by the quality and depth of the RoboSpark curriculum. My son not only learned technical skills but also improved his problem-solving abilities and teamwork. It's an investment in his future I'm glad we made.",
      name: "Michael Chen",
      role: "Parent of Ethan, 12",
      avatar: "https://via.placeholder.com/96",
    },
    {
      id: 3,
      content:
        "RoboSpark exceeded our expectations! The instructors created a supportive environment where my naturally shy son felt comfortable taking risks and asking questions. He's already asking to sign up for next year.",
      name: "James Wilson",
      role: "Parent of Noah, 10",
      avatar: "https://via.placeholder.com/96",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }
  };

  const prevTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + testimonials.length) % testimonials.length
      );
    }
  };

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial();
    }, 8000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
            What Parents Are Saying
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Don't just take our word for it. Here's what parents of RoboSpark
            participants have to share about their children's experiences.
          </p>
        </motion.div>

        <div className="mt-16 flex flex-col items-center">
          <div className="relative h-[250px] w-full max-w-3xl">
            <AnimatePresence
              initial={false}
              mode="wait"
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 p-6 sm:p-8"
              >
                <Quote className="mb-4 h-8 w-8 text-accent" />
                <p className="mb-6 text-lg text-gray-700">
                  "{testimonials[currentIndex].content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="mr-4 h-12 w-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-secondary">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <button
              onClick={prevTestimonial}
              className="rounded-full p-2 text-gray-600 transition-colors hover:bg-primary/10 hover:text-primary"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full ${
                  index === currentIndex
                    ? "bg-primary"
                    : "bg-gray-300 hover:bg-primary/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
            <button
              onClick={nextTestimonial}
              className="rounded-full p-2 text-gray-600 transition-colors hover:bg-primary/10 hover:text-primary"
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
