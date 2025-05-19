import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/Card";
import { Cpu, Code, Brain, Lightbulb } from "lucide-react";

export function Introduction() {
  const features = [
    {
      icon: <Cpu className="h-8 w-8 text-primary" />,
      title: "Robotics Fundamentals",
      description:
        "Learn the building blocks of robot design, mechanics, and electronics through hands-on projects.",
    },
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "Coding & Programming",
      description:
        "Discover how to bring robots to life with intuitive block-based and text-based programming languages.",
    },
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Problem-Solving Skills",
      description:
        "Develop critical thinking and analytical skills by solving real-world challenges with robotic solutions.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Creative Innovation",
      description:
        "Unleash creativity by designing and building unique robotic projects from imagination to reality.",
    },
  ];

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
            Welcome to <span className="text-primary">RoboSpark</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our innovative summer robotics program combines engaging activities,
            expert instruction, and cutting-edge technology to inspire the next
            generation of engineers and innovators.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-secondary">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-3xl rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-6 text-center sm:p-8"
        >
          <h3 className="text-xl font-medium text-secondary sm:text-2xl">
            "The best way to predict the future is to create it."
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            We're empowering the next generation to build the technologies of
            tomorrow.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
