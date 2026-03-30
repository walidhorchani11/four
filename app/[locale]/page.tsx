import { Header } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/hero-section'
import { ProblemSection } from '@/components/landing/problem-section'
import { BenefitsSection } from '@/components/landing/benefits-section'
import { ProductsSection } from '@/components/landing/products-section'
import { ComparisonSection } from '@/components/landing/comparison-section'
import { UrgencySection } from '@/components/landing/urgency-section'
import { FAQSection } from '@/components/landing/faq-section'
import { FinalCTASection } from '@/components/landing/final-cta-section'
import { Footer } from '@/components/landing/footer'
import { WhatsAppButton } from '@/components/landing/whatsapp-button'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <BenefitsSection />
        <ProductsSection />
        <ComparisonSection />
        <UrgencySection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
