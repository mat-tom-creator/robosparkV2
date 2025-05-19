import { Hero } from "./Hero";
import { Introduction } from "./Introduction";
import { Benefits } from "./Benefits";
import { Testimonials } from "./Testimonials";
import { CountdownTimer } from "./CountdownTimer";
import { CTASection } from "./CTASection";

export function HomePage() {
  return (
    <>
      <Hero />
      <Introduction />
      <Benefits />
      <CountdownTimer />
      <Testimonials />
      <CTASection />
    </>
  );
}
