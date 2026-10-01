import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { emailFor, getSiteSettings } from "../../../../sanity/lib/fetch";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join IndiskaAI. We're hiring researchers, engineers, and scientists to build the next generation of generative biology.",
};

const roles = [
  {
    team: "Research",
    title: "Research Scientist, Structural Biology",
    location: "Pune · Hybrid",
    blurb:
      "Lead structure-prediction research across protein–protein, protein–ligand, and nucleic-acid systems. Comfortable with cryo-EM, MD, and modern structure models.",
  },
  {
    team: "Engineering",
    title: "ML Engineer, Foundation Models",
    location: "Pune · Hybrid",
    blurb:
      "Train and serve sequence-and-structure foundation models. Strong PyTorch, distributed training, and an eye for empirical rigor.",
  },
  {
    team: "Engineering",
    title: "Computational Chemist",
    location: "Remote · India",
    blurb:
      "Build and curate the FEP, ADMET, and selectivity scoring pipeline. Bridge medicinal chemistry intuition with reproducible computation.",
  },
  {
    team: "Founding",
    title: "Founding Scientist (Open)",
    location: "Pune",
    blurb:
      "If you've published in or shipped at the intersection of generative AI and therapeutics, we should talk regardless of role title.",
  },
];

const principles = [
  {
    title: "Wet-lab respect.",
    body: "We test our models against ground truth, not just held-out splits. Validation rigor is non-negotiable.",
  },
  {
    title: "Small teams, big stakes.",
    body: "You will own a problem end-to-end, from research idea to production pipeline. The org is intentionally lean.",
  },
  {
    title: "Open by default.",
    body: "We benchmark publicly, contribute upstream where we can, and write things up. Science compounds when shared.",
  },
];

export default async function CareersPage() {
  const settings = await getSiteSettings();
  const careersEmail = emailFor(settings, "Careers");
  return (
    <main className="relative">
      <PageHeader
        eyebrow="Careers"
        title={
          <>
            Join the mission to{" "}
            <span className="italic text-navy">design biology.</span>
          </>
        }
        lede="We're a small, deliberate team building a long-horizon company. If you'd rather see your work in a clinical readout than a benchmark leaderboard, you'll fit in here."
      />

      {/* Principles */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="kicker mb-10">How we work</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {principles.map((p) => (
              <div key={p.title} className="border-t border-black/10 pt-6">
                <h3 className="font-display text-[1.6rem] md:text-[1.9rem] leading-[1.1] tracking-tightest text-ink mb-3">
                  {p.title}
                </h3>
                <p className="text-ink-soft leading-[1.6]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-20 md:py-28 bg-cream-50">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="kicker mb-4">Open roles</div>
              <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1] tracking-tightest text-ink">
                Currently hiring
              </h2>
            </div>
            <p className="md:max-w-[36ch] text-ink-soft leading-[1.6]">
              Don&apos;t see a perfect fit? We always read thoughtful applications.
              Email us a short note about what you&apos;d build.
            </p>
          </div>

          <ul className="border-y border-black/10">
            {roles.map((r) => (
              <li
                key={r.title}
                className="group border-b border-black/10 last:border-b-0"
              >
                <a
                  href={`mailto:${careersEmail}?subject=Application`}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-7 px-2 md:px-4 transition-colors hover:bg-cream-100"
                >
                  <div className="flex items-baseline gap-5">
                    <span className="kicker text-ink-muted shrink-0 w-24">{r.team}</span>
                    <div>
                      <div className="font-display text-[1.4rem] md:text-[1.8rem] leading-[1.1] tracking-tightest text-ink">
                        {r.title}
                      </div>
                      <p className="mt-2 text-ink-soft text-[0.97rem] leading-[1.55] max-w-[70ch]">
                        {r.blurb}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 md:shrink-0">
                    <span className="text-[0.85rem] text-ink-muted">{r.location}</span>
                    <span className="cta-arrow text-ink transition-transform">→</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex flex-wrap items-center gap-4">
            <a href={`mailto:${careersEmail}`} className="cta">
              Email {careersEmail}
              <span className="cta-arrow">→</span>
            </a>
            {/* "Meet the team" CTA hidden while /team is — see src/app/(site)/team/page.tsx. */}
          </div>
        </div>
      </section>
    </main>
  );
}
