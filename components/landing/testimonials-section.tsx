"use client"

import { Star } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Mohamed B.",
    location: "Tunis",
    text: "Excellent four ! La cuisson est parfaite et je ne depend plus de l'electricite. Je recommande vivement.",
    rating: 5
  },
  {
    name: "Fatma H.",
    location: "Sousse",
    text: "J'utilise ce four pour ma petite patisserie. La qualite de cuisson est professionnelle et les economies sont reelles.",
    rating: 5
  },
  {
    name: "Ahmed K.",
    location: "Sfax",
    text: "Livraison rapide et produit conforme. Mon pain est parfait maintenant. Tres satisfait de mon achat.",
    rating: 5
  },
  {
    name: "Sana M.",
    location: "Bizerte",
    text: "Parfait pour faire des pizzas maison ! Chauffe tres vite et la cuisson est uniforme. Ma famille adore.",
    rating: 5
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ils nous font confiance
          </h2>
          <p className="text-lg text-muted-foreground">
            +100 clients satisfaits en Tunisie
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Text */}
              <p className="mb-6 text-muted-foreground">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-primary/10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {testimonial.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
