import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export function Benefits() {
  const benefits = [
    "Small class sizes with personalized attention",
    "Expert instructors with industry experience",
    "State-of-the-art robotics equipment and technology",
    "Project-based learning with take-home creations",
    "Age-appropriate curriculum for different skill levels",
    "Focus on both technical skills and creative thinking",
    "Safe and supportive learning environment",
    "End-of-session showcase and competitions",
  ];

  return (
    <section className="bg-secondary py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why Choose <span className="text-accent">RoboSpark</span>?
            </h2>
            <p className="text-lg text-gray-300">
              Our program is designed to provide a comprehensive learning
              experience that goes beyond basic robotics. We focus on developing
              well-rounded skills that prepare children for future success in
              STEM fields.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-accent" />
                  <span className="text-gray-200">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative flex items-center"
          >
            <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-accent to-primary opacity-20 blur-xl"></div>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <img
                src="https://via.placeholder.com/800x450"
                alt="Children learning robotics"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
