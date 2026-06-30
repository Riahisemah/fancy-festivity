import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Vélon — Invitations digitales élégantes" },
      { name: "description", content: "Créez et partagez des invitations digitales premium en quelques minutes. Mariage, anniversaire, événement business." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/20">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="font-serif text-2xl tracking-tight">Vélon</Link>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Se connecter
            </Link>
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-accent transition-colors"
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pt-24 pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7 animate-reveal">
            <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
              <Sparkles className="size-3" />
              Invitations digitales premium
            </span>
            <h1 className="mt-6 font-serif text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-balance">
              Une invitation <em className="text-accent">qui se souvient</em> d'être belle.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Concevez des pages d'invitation soignées, partagez-les via un lien unique, et suivez les confirmations en temps réel.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground hover:bg-accent transition-all"
              >
                Créer une invitation
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#themes" className="text-sm font-medium text-foreground/70 hover:text-foreground">
                Voir les thèmes →
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 animate-reveal [animation-delay:200ms]">
            <div className="relative aspect-[3/4] rounded-2xl bg-card shadow-2xl shadow-ink/10 ring-1 ring-border overflow-hidden p-10 flex flex-col items-center justify-center text-center">
              <div className="h-px w-16 bg-accent mb-6" />
              <p className="font-serif italic text-muted-foreground mb-4">Save the Date</p>
              <h2 className="font-serif text-5xl leading-tight">Eléonore<br/><span className="italic font-normal">&</span><br/>Julian</h2>
              <p className="mt-8 text-xs uppercase tracking-[0.3em] text-accent">12 Juin 2026</p>
              <p className="mt-2 text-sm text-muted-foreground">Château de Varennes</p>
              <div className="mt-10 rounded-full border border-ink px-8 py-3 text-[11px] uppercase tracking-widest">
                RSVP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Themes */}
      <section id="themes" className="border-t border-border bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-2xl">
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">Thèmes</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">Six directions, mille possibilités.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Mariage", desc: "Luxe romantique, dorures et flou élégant", emoji: "💍" },
              { name: "Anniversaire", desc: "Gradient vibrant, confettis & ballons", emoji: "🎂" },
              { name: "Business", desc: "Corporate premium, sombre et net", emoji: "💼" },
              { name: "Graduation", desc: "Académique, lumière inspirante", emoji: "🎓" },
              { name: "Luxury VIP", desc: "Noir & or, glassmorphism premium", emoji: "🌙" },
              { name: "Minimal", desc: "Espace blanc, élégance pure", emoji: "✨" },
            ].map((t) => (
              <div key={t.name} className="group rounded-2xl bg-card p-8 ring-1 ring-border transition-all hover:shadow-xl hover:shadow-ink/5 hover:-translate-y-1">
                <div className="text-3xl mb-6">{t.emoji}</div>
                <h3 className="font-serif text-2xl">{t.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row items-center justify-between gap-4 px-6">
          <span className="font-serif text-xl">Vélon</span>
          <p className="text-xs text-muted-foreground">© 2026 Vélon. Invitations digitales pensées avec soin.</p>
        </div>
      </footer>
    </div>
  );
}
