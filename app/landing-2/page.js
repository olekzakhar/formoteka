import { createClient } from '@/utils/supabase/server'
import Header from '@/components/landing-2/Header'
import Hero from '@/components/landing-2/Hero'
import PainPoints from "@/components/landing-2/PainPoints";
import BeforeAfter from "@/components/landing-2/BeforeAfter";
import Benefits from "@/components/landing-2/Benefits";
import WhoIsItFor from "@/components/landing-2/WhoIsItFor";
import FAQ from "@/components/landing-2/FAQ";
import FinalCTA from "@/components/landing-2/FinalCTA";
import Footer from "@/components/landing-2/Footer";

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