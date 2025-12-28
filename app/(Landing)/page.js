// app/page

import { createClient } from '@/utils/supabase/server'
import Header from "@/components/landing/Header"
import HeroSection from "@/components/landing/Hero"
import PainSection from "@/components/landing/Pain"
import ComparisonSection from "@/components/landing/Comparison"
import BenefitsSection from "@/components/landing/Benefits"
import ForWhoSection from "@/components/landing/ForWho"
import FAQSection from "@/components/landing/FAQ"
import CTASection from "@/components/landing/CTA"
import Footer from "@/components/landing/Footer"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <Header isUser={!!user} />
      <main>
        <HeroSection />
        <PainSection />
        <ComparisonSection />
        <BenefitsSection />
        <ForWhoSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
