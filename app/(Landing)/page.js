// app/(Landing)/page

import dynamic from 'next/dynamic';

import { createClient } from '@/utils/supabase/server'
import Header from "@/components/landing/Header"
import HeroSection from "@/components/landing/Hero"

// Lazy load below-the-fold sections
// Це щоб прискорити завантаження сторінки, щоб одразу завантажувався лише Header, Hero
const ComparisonSection = dynamic(() => import("@/components/landing/Comparison"));
const BenefitsSection = dynamic(() => import("@/components/landing/Benefits"));
const PricingSection = dynamic(() => import("@/components/landing/Pricing"));
const FAQSection = dynamic(() => import("@/components/landing/FAQ"));
const CTASection = dynamic(() => import("@/components/landing/CTA"));
const Footer = dynamic(() => import("@/components/landing/Footer"));

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <Header isUser={!!user} />
      <main>
        <HeroSection />
        <BenefitsSection />
        <ComparisonSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
