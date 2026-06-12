import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Bienvenue · O'Studio Academy",
  description: "Tu es sur la liste. On se retrouve bientôt.",
}

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C9A96E 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10 text-center max-w-2xl animate-fade-up">
        <div className="flex justify-center mb-10">
          <div className="w-16 h-16 border border-gold/40 flex items-center justify-center">
            <svg className="w-7 h-7 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col items-center mb-8">
          <span className="font-display text-xl font-light tracking-widest text-cream">
            O&apos;STUDIO
          </span>
          <span className="text-[9px] font-body tracking-widest uppercase text-gold mt-1">
            Academy
          </span>
        </div>
        <p className="text-[10px] font-body tracking-widest uppercase text-gold/60 mb-4">
          Tu es sur la liste
        </p>
        <h1 className="heading-display text-4xl md:text-5xl text-cream mb-6">
          Bienvenue dans l&apos;académie.
        </h1>
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="w-8 h-px bg-gold/30" />
          <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
          <span className="w-8 h-px bg-gold/30" />
        </div>
        <p className="text-cream/60 font-body font-light text-lg leading-relaxed mb-12 max-w-lg mx-auto">
          Ton inscription est confirmée. Tu seras parmi les premiers à recevoir
          l&apos;accès aux formations, aux ressources exclusives et aux tarifs fondateurs.
        </p>
        <div className="bg-obsidian-soft border border-gold/15 p-8 mb-10 text-left">
          <p className="text-[10px] font-body tracking-widest uppercase text-gold/50 mb-5">
            La suite
          </p>
          <div className="space-y-4">
            {[
              "Surveille ta boite courriel — une confirmation t'attend.",
              "Partage l'académie avec une amie créative qui en a besoin.",
              'Le lancement approche. Garde ta place bien au chaud.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 border border-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="font-display text-xs text-gold/60">{i + 1}</span>
                </span>
                <p className="text-cream/55 text-sm font-body font-light leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Link
          href="/"
          className="text-xs font-body tracking-widest uppercase text-gold/50 hover:text-gold transition-colors duration-200 border-b border-gold/20 hover:border-gold pb-0.5"
        >
          Retour à l&apos;académie
        </Link>
      </div>
    </main>
  )
}
