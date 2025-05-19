import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    subject: "General Inquiry",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        phone: "",
        message: "",
        subject: "General Inquiry",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
            Contact <span className="text-primary">RoboSpark</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Have questions about our robotics program? Get in touch with our
            team and we'll be happy to help.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-secondary">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex">
                  <MapPin className="mr-3 h-6 w-6 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="font-medium text-secondary">Address</h3>
                    <p className="mt-1 text-gray-600">
                      123 Innovation Way
                      <br />
                      Techville, TX 75001
                      <br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <Phone className="mr-3 h-6 w-6 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="font-medium text-secondary">Phone</h3>
                    <p className="mt-1 text-gray-600">
                      <a href="tel:+15551234567" className="hover:text-primary">
                        (555) 123-4567
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <Mail className="mr-3 h-6 w-6 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="font-medium text-secondary">Email</h3>
                    <p className="mt-1 text-gray-600">
                      <a
                        href="mailto:info@robospark.com"
                        className="hover:text-primary"
                      >
                        info@robospark.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <Clock className="mr-3 h-6 w-6 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="font-medium text-secondary">Office Hours</h3>
                    <p className="mt-1 text-gray-600">
                      Monday - Friday: 9:00 AM - 5:00 PM
                      <br />
                      Saturday: 10:00 AM - 2:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-lg bg-primary/5 p-4">
                <h3 className="font-medium text-secondary">Quick Response</h3>
                <p className="mt-1 text-sm text-gray-600">
                  We aim to respond to all inquiries within 24 hours during
                  business days.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-secondary">
                Send us a Message
              </h2>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-6 text-center">
                  <CheckCircle className="mb-4 h-12 w-12 text-green-500" />
                  <h3 className="text-xl font-semibold text-secondary">
                    Message Sent!
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Thank you for reaching out. We've received your message and
                    will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Your Name*
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address*
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone Number (Optional)
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formState.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Subject*
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Registration Question">
                          Registration Question
                        </option>
                        <option value="Course Information">
                          Course Information
                        </option>
                        <option value="Payment Issue">Payment Issue</option>
                        <option value="Feedback">Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message*
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formState.message}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <img
                src="https://via.placeholder.com/1200x600"
                alt="Map to RoboSpark location"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-center text-secondary">
            Frequently Asked Questions
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-white p-6">
              <h3 className="text-lg font-semibold text-secondary">
                What age groups do you accommodate?
              </h3>
              <p className="mt-2 text-gray-600">
                Our summer robotics program is designed for children ages 7-16.
                We have courses tailored to different age groups and skill
                levels.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <h3 className="text-lg font-semibold text-secondary">
                Do participants need prior experience?
              </h3>
              <p className="mt-2 text-gray-600">
                No prior experience is necessary! We offer beginner courses for
                those who are new to robotics, as well as intermediate and
                advanced courses for students with previous experience.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <h3 className="text-lg font-semibold text-secondary">
                What is your cancellation policy?
              </h3>
              <p className="mt-2 text-gray-600">
                Full refunds are available for cancellations made 14 days or
                more before the course start date. A 50% refund is available for
                cancellations made 7-13 days before the start date.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <h3 className="text-lg font-semibold text-secondary">
                Do participants get to keep what they build?
              </h3>
              <p className="mt-2 text-gray-600">
                For most courses, the robotics kits remain at our facility for
                future classes. However, each participant will receive a
                take-home project at the end of the session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
