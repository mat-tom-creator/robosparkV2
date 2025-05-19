import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { paths } from "../../routes/paths";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-xl font-bold">
              <span className="text-primary">Robo</span>
              <span className="text-accent">Spark</span>
            </h3>
            <p className="mb-4 text-gray-300">
              Igniting young minds with robotics education and STEM learning
              experiences.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-accent"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-accent"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-accent"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-accent"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={paths.home}
                  className="text-gray-300 hover:text-accent"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={paths.courses}
                  className="text-gray-300 hover:text-accent"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to={paths.about}
                  className="text-gray-300 hover:text-accent"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to={paths.contact}
                  className="text-gray-300 hover:text-accent"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to={paths.register}
                  className="text-gray-300 hover:text-accent"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-accent" />
                <span className="text-gray-300">
                  123 Innovation Way, Techville, TX 75001
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-accent" />
                <span className="text-gray-300">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-accent" />
                <a
                  href="mailto:info@robospark.com"
                  className="text-gray-300 hover:text-accent"
                >
                  info@robospark.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Newsletter</h3>
            <p className="mb-4 text-gray-300">
              Subscribe to our newsletter for the latest updates and promotions.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="rounded-md px-4 py-2 text-dark focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
              <button
                type="submit"
                className="rounded-md bg-accent px-4 py-2 font-medium text-dark hover:bg-accent/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-300">
          <p>
            &copy; {currentYear} RoboSpark. All rights reserved. | Privacy
            Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
