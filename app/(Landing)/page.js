// app/page

import { createClient } from '@/utils/supabase/server'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import PainPoints from "@/components/landing/PainPoints";
import BeforeAfter from "@/components/landing/BeforeAfter";
import Benefits from "@/components/landing/Benefits";
import WhoIsItFor from "@/components/landing/WhoIsItFor";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <Header isUser={!!user} />
      <main>
        <Hero />
        <PainPoints />
        <BeforeAfter />
        <Benefits />
        <WhoIsItFor />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
