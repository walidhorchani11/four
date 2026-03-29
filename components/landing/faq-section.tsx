"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Comment se fait la livraison ?",
    answer: "Nous livrons dans toute la Tunisie en 24-48h. Vous recevrez un appel de confirmation avant la livraison."
  },
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer: "Nous acceptons le paiement a la livraison (cash), avec WafaCash , IZI payement, Poste ou virement bancaire"
  },
  {
    question: "Le four est-il facile a utiliser ?",
    answer: "Absolument ! Nos fours sont concus pour une utilisation simple et securisee."
  },
  {
    question: "Quel type de gaz utiliser ?",
    answer: "Nos fours fonctionnent avec du butane ou du propane, les bouteilles de gaz standard disponibles partout en Tunisie."
  },
  {
    question: "Peut-on l'utiliser pour un commerce ?",
    answer: "Oui, nos modeles Professionnel et Pizza sont parfaits pour les boulangeries, patisseries, pizzerias et snacks."
  }
]

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-background scroll-mt-24 md:scroll-mt-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Questions frequentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Trouvez les reponses a vos questions
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
                <AccordionTrigger className="text-left text-foreground hover:text-primary py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
