import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useAuth } from "@/lib/auth-context";
import {
  OPENER_ANIMATIONS,
  SECTION_TRANSITIONS,
} from "@/lib/animations";

export const Route = createFileRoute("/_authenticated/animations")({
  ssr: false,
  head: () => ({ meta: [{ title: "Animations — Vélon" }] }),
  component: AnimationsPage,
});

function AnimationsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const elegant = OPENER_ANIMATIONS.filter((a) => a.category === "elegant" || a.id === "auto");
  const modern = OPENER_ANIMATIONS.filter((a) => a.category === "modern");

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav email={user?.email} onSignOut={signOut} onCreate={() => navigate({ to: "/dashboard", search: { create: true } })} />
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-8 sm:py-10 pb-24 md:pb-10">
        <div className="mb-10">
          <h1 className="font-serif text-4xl tracking-tight">Bibliothèque d&apos;animations</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Découvrez les animations d&apos;ouverture et les transitions entre sections disponibles pour vos invitations.
            Personnalisez-les dans l&apos;éditeur de chaque invitation.
          </p>
        </div>

        <section className="mb-14">
          <h2 className="font-serif text-2xl mb-1">✨ Animations élégantes</h2>
          <p className="text-sm text-muted-foreground mb-6">Ouvertures classiques et premium pour mariages, cérémonies et événements prestigieux.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {elegant.map((anim) => (
              <AnimationCard key={anim.id} anim={anim} />
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="font-serif text-2xl mb-1">🚀 Animations modernes</h2>
          <p className="text-sm text-muted-foreground mb-6">Effets 3D, cinéma et glassmorphism pour une expérience immersive.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {modern.map((anim) => (
              <AnimationCard key={anim.id} anim={anim} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-1">Transitions entre sections</h2>
          <p className="text-sm text-muted-foreground mb-6">Style de passage entre chaque bloc de votre invitation.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SECTION_TRANSITIONS.map((tr) => (
              <div key={tr.id} className="rounded-2xl border border-border bg-card p-4 text-center">
                <div className="text-2xl mb-2">{tr.emoji}</div>
                <div className="text-sm font-medium">{tr.name}</div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{tr.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl">Appliquer à une invitation</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ouvrez l&apos;éditeur d&apos;une invitation et utilisez la section Animations pour choisir et prévisualiser.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 shrink-0"
          >
            <Play className="size-4" /> Mes invitations
          </Link>
        </div>
      </main>
    </div>
  );
}

function AnimationCard({ anim }: { anim: (typeof OPENER_ANIMATIONS)[number] }) {
  const intensityLabel = { soft: "Doux", medium: "Modéré", intense: "Intense" }[anim.intensity];
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="h-32 relative flex items-center justify-center bg-muted/40 overflow-hidden">
        <motion.span
          animate={{ scale: [1, 1.12, 1], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-4xl relative z-10"
        >
          {anim.emoji}
        </motion.span>
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/10" />
      </div>
      <div className="p-4">
        <div className="font-medium">{anim.nameFr}</div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{anim.description}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted">{intensityLabel}</span>
          {anim.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
