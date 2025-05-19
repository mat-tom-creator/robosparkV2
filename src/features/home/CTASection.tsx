import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { paths } from "../../routes/paths";

export function CTASection() {
  return (
    <section className="bg-gradient-to-b from-primary to-secondary py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-xl sm:p-12"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              Ready to Spark Your Child's Interest in Robotics?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Enrollment for our Summer 2025 session is now open. Secure your
              child's spot today and take advantage of our early bird discount!
            </p>

            <div className="mt-8 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" variant="accent" asChild>
                <Link to={paths.register}>Register Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={paths.contact}>Contact Us</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Limited spots available. Early bird pricing ends June 1, 2025.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
