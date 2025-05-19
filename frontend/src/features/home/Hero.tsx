import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { paths } from "../../routes/paths";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-16">
      <div className="container mx-auto px-4 py-12 sm:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-block rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-primary">
              Summer 2025
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-secondary sm:text-5xl md:text-6xl">
              Ignite Your Child's{" "}
              <span className="text-primary">Robotics Journey</span>
            </h1>
            <p className="text-lg text-gray-600">
              Join RoboSpark's immersive summer sessions where young minds
              explore robotics, coding, and engineering through hands-on
              learning experiences.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" asChild>
                <Link to={paths.register}>Register Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to={paths.courses}>Explore Courses</Link>
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Ages 7-16</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>All Skill Levels</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Expert Instruction</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto aspect-square max-w-md rounded-2xl md:mx-0"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-secondary opacity-20 blur-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-2xl bg-white p-2 shadow-xl">
                <img
                  src="https://via.placeholder.com/500x500"
                  alt="Children building robots"
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-accent opacity-10 blur-xl"></div>
      <div className="absolute right-1/4 top-1/4 h-32 w-32 rounded-full bg-primary opacity-10 blur-xl"></div>
      <div className="absolute bottom-1/3 right-0 h-40 w-40 rounded-full bg-secondary opacity-10 blur-xl"></div>
    </div>
  );
}
