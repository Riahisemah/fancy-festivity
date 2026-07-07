import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Wand2, Music, QrCode, Smartphone, Globe, Star } from "lucide-react";
import { COMMERCIAL_PACKS } from "@/lib/templates/marketplace";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Vélon — Invitations digitales tunisiennes" },
      {
        name: "description",
        content:
          "La plateforme spécialisée dans les invitations digitales tunisiennes et arabophones. 140+ modèles, assistant IA, animations immersives.",
      },
    ],
  }),
  component: Landing,
});

const TUNISIAN_EVENTS = [
  { emoji: "💍", name: "Mariage tunisien" },
  { emoji: "💎", name: "Fiançailles" },
  { emoji: "🌿", name: "Henné" },
  { emoji: "👶", name: "Sbou3 & naissance" },
  { emoji: "🎓", name: "Diplôme" },
  { emoji: "🌙", name: "Ramadan & Aïd" },
  { emoji: "🕌", name: "Mouled" },
  { emoji: "💼", name: "Professionnel" },
];

const FEATURES = [
  { icon: Wand2, title: "Assistant IA", desc: "Créez votre invitation en 30 secondes — textes, couleurs et structure automatiques." },
  { icon: Sparkles, title: "140+ modèles", desc: "Mariage, henné, fiançailles, naissance… Des designs authentiques inspirés de la culture tunisienne." },
  { icon: Smartphone, title: "Mode Story", desc: "Sur mobile, vos invités parcourent l'invitation comme des stories Instagram." },
  { icon: Music, title: "Musique de fond", desc: "Romantique, orientale, tunisienne — ambiance sonore en un clic." },
  { icon: QrCode, title: "Partage instantané", desc: "QR code, WhatsApp, Facebook, Instagram — lien court prêt à envoyer." },
  { icon: Globe, title: "Bilingue AR / FR", desc: "Invitations en arabe, français ou bilingues — parfait pour la diaspora." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/20">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md safe-top">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="font-serif text-2xl tracking-tight">Vélon</Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
              Connexion
            </Link>
            <Link
              to="/auth"
              className="rounded-full bg-primary px-4 sm:px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-accent transition-colors"
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
              🇹🇳 Spécialiste Tunisie & Arabe
            </span>
            <h1 className="mt-6 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-balance">
              L&apos;invitation digitale <em className="text-accent">à la tunisienne</em>
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Mariage, henné, fiançailles, sbou3, Ramadan… Créez une invitation magnifique en quelques minutes,
              sans compétences techniques. Partagez par WhatsApp en un clic.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/auth"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-medium text-primary-foreground hover:bg-accent transition-all"
              >
                Créer mon invitation
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#offres" className="inline-flex items-center rounded-full border border-border px-6 py-3.5 text-sm font-medium hover:bg-muted transition">
                Voir les offres
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="size-3.5 text-accent" /> 140+ modèles</span>
              <span>·</span>
              <span>Assistant IA</span>
              <span>·</span>
              <span>Mobile-first</span>
              <span>·</span>
              <span>PWA installable</span>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[3/4] max-w-sm mx-auto rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100 shadow-2xl ring-1 ring-border overflow-hidden p-8 sm:p-10 flex flex-col items-center justify-center text-center">
              <p className="font-arabic-display text-lg text-amber-800/70 mb-2">بسم الله الرحمن الرحيم</p>
              <div className="h-px w-12 bg-amber-600/40 mb-6" />
              <p className="text-[10px] uppercase tracking-[0.35em] text-amber-700/60">Mariage</p>
              <h2 className="mt-4 font-serif text-3xl sm:text-4xl text-amber-950 leading-tight">
                Amira<br />
                <span className="italic font-normal text-2xl">&</span><br />
                Youssef
              </h2>
              <p className="mt-6 font-arabic text-sm text-amber-800/80">السبت ١٥ أوت ٢٠٢٦</p>
              <p className="mt-1 text-xs text-amber-700/60">Salle des fêtes — Tunis</p>
              <div className="mt-8 rounded-full border border-amber-800/30 px-6 py-2.5 text-[10px] uppercase tracking-widest text-amber-900/70">
                Ouvrir l&apos;invitation
              </div>
            </div>
            <div className="absolute -bottom-4 -left-2 sm:left-0 rounded-2xl bg-card border border-border px-4 py-3 shadow-lg text-xs">
              <span className="text-accent font-medium">+2 400</span> invitations créées
            </div>
          </div>
        </div>
      </section>

      {/* Événements tunisiens */}
      <section className="border-t border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] uppercase tracking-[0.3em] text-accent">🇹🇳 Spécial Tunisie</span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl tracking-tight">Chaque événement, son design</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Peu de plateformes internationales proposent ces célébrations avec des modèles adaptés.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {TUNISIAN_EVENTS.map((e) => (
              <div key={e.name} className="rounded-2xl bg-card border border-border p-4 sm:p-5 text-center hover:shadow-md transition">
                <div className="text-2xl sm:text-3xl mb-2">{e.emoji}</div>
                <p className="text-xs sm:text-sm font-medium">{e.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.3em] text-accent">Fonctionnalités</span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl tracking-tight">Tout ce dont vos invités rêvent</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl bg-card border border-border p-6 hover:shadow-lg transition">
                <f.icon className="size-5 text-accent mb-4" />
                <h3 className="font-serif text-xl">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offres */}
      <section id="offres" className="border-t border-border bg-secondary/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-[0.3em] text-accent">Tarifs</span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl tracking-tight">Des offres pour chaque besoin</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Object.entries(COMMERCIAL_PACKS).map(([key, pack]) => (
              <div
                key={key}
                className={`rounded-2xl border p-6 flex flex-col ${key === "silver" ? "border-accent bg-accent/5 ring-1 ring-accent/20" : "border-border bg-card"}`}
              >
                {key === "silver" && (
                  <span className="text-[10px] uppercase tracking-wider text-accent font-medium mb-2">Populaire</span>
                )}
                <h3 className="font-serif text-2xl">{pack.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {pack.invitations} invitation{typeof pack.invitations === "number" && pack.invitations > 1 ? "s" : ""}
                  <br />
                  {pack.templates} templates
                </p>
                <ul className="mt-4 space-y-2 flex-1">
                  {pack.features.map((f) => (
                    <li key={f} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-accent">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/auth"
                  className={`mt-6 block text-center rounded-full py-3 text-sm font-medium transition ${
                    key === "silver"
                      ? "bg-primary text-primary-foreground hover:bg-accent"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  Commencer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight">
            Prêt à créer votre invitation ?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Rejoignez la plateforme des invitations digitales tunisiennes. Simple, belle, mémorable.
          </p>
          <Link
            to="/auth"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground hover:bg-accent transition"
          >
            <Wand2 className="size-4" /> Créer avec l&apos;IA — gratuit pour commencer
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-10 safe-bottom">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
          <span className="font-serif text-xl">Vélon</span>
          <p className="text-xs text-muted-foreground text-center">
            © 2026 Vélon — Invitations digitales tunisiennes & arabophones
          </p>
        </div>
      </footer>
    </div>
  );
}
