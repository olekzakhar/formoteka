// app/page

import { createClient } from '@/utils/supabase/server'
import Header from "@/components/landing/Header"
import HeroSection from "@/components/landing/Hero"
import PainSection from "@/components/landing/PainSection"
import ComparisonSection from "@/components/landing/ComparisonSection"
import BenefitsSection from "@/components/landing/BenefitsSection"
import ForWhoSection from "@/components/landing/ForWhoSection"
import FAQSection from "@/components/landing/FAQSection"
import CTASection from "@/components/landing/CTASection"
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
