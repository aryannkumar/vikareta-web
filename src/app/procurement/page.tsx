"use client";

import ProcurementHero from '../../components/landing/procurement/Hero';
import HowItWorks from '../../components/landing/procurement/HowItWorks';
import BusinessesGrid from '../../components/landing/procurement/BusinessesGrid';
import Features from '../../components/landing/procurement/Features';
import TestimonialsCarousel from '../../components/landing/procurement/Testimonials';
import { RevealSection } from '../../components/Animated';

export default function ProcurementLanding() {
  return (
    <div className="relative">
      <ProcurementHero />
      <RevealSection>
        <HowItWorks />
      </RevealSection>
      <RevealSection>
        <BusinessesGrid />
      </RevealSection>
      <RevealSection>
        <Features />
      </RevealSection>
      <RevealSection>
        <TestimonialsCarousel />
      </RevealSection>
    </div>
  );
}
