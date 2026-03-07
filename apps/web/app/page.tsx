import Link from "next/link";
import styles from "./page.module.css";

const features = [
  {
    icon: "◎",
    title: "Multi-Tenant Agents",
    desc: "Each business gets isolated agents with their own knowledge base, configurations, and call routing.",
  },
  {
    icon: "⬡",
    title: "RAG-Powered Answers",
    desc: "Upload PDFs, docs, or FAQs. Agents retrieve the right context before every response — no hallucinations.",
  },
  {
    icon: "⌁",
    title: "Real-Time Voice",
    desc: "Sub-second latency via WebSocket streaming. Twilio → STT → LLM → TTS — callers hear a natural voice.",
  },
  {
    icon: "◈",
    title: "Any Use Case",
    desc: "Support, sales, booking, FAQs. Deploy different agents for different workflows from one dashboard.",
  },
];

const stack = ["Twilio", "Azure STT", "Groq LLM", "Vector DB", "WebSockets", "TTS"];

const steps = [
  { n: "01", title: "Create an agent", desc: "Name it, set its persona, and configure its behavior." },
  { n: "02", title: "Upload your data", desc: "PDFs, docs, URLs — we index and embed it automatically." },
  { n: "03", title: "Connect a number", desc: "Assign a Twilio number. Your agent is live in minutes." },
  { n: "04", title: "Callers get answers", desc: "Real conversations, grounded in your data, 24/7." },
];

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <span className={styles.wordmark}>AIcaller</span>
        <div className={styles.navLinks}>
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <Link href="/dashboard" className={styles.navCta}>
            Open Dashboard →
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>Voice AI Infrastructure</div>
          <h1 className={styles.heroTitle}>
            Your business,<br />
            <span className={styles.accent}>answering every call.</span>
          </h1>
          <p className={styles.heroSub}>
            Deploy intelligent phone agents that understand callers, search your
            knowledge base, and respond in natural speech — in real time.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/dashboard" className={styles.primaryBtn}>
              Start building free
            </Link>
            <a href="#how" className={styles.ghostBtn}>
              See how it works
            </a>
          </div>
          <div className={styles.stackRow}>
            {stack.map((s) => (
              <span key={s} className={styles.stackPill}>{s}</span>
            ))}
          </div>
        </section>

        {/* Call flow diagram */}
        <section className={styles.flow} id="how">
          <p className={styles.sectionLabel}>Call flow</p>
          <h2 className={styles.sectionTitle}>From ring to response in milliseconds</h2>
          <div className={styles.flowDiagram}>
            {[
              { label: "Caller", sub: "dials your number" },
              { label: "Twilio", sub: "streams audio" },
              { label: "Azure STT", sub: "speech → text" },
              { label: "RAG", sub: "retrieves context" },
              { label: "LLM", sub: "generates answer" },
              { label: "TTS", sub: "text → speech" },
            ].map((node, i, arr) => (
              <div key={node.label} className={styles.flowRow}>
                <div className={styles.flowNode}>
                  <span className={styles.flowLabel}>{node.label}</span>
                  <span className={styles.flowSub}>{node.sub}</span>
                </div>
                {i < arr.length - 1 && <span className={styles.flowArrow}>→</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section className={styles.steps}>
          <p className={styles.sectionLabel}>Getting started</p>
          <h2 className={styles.sectionTitle}>Live in four steps</h2>
          <div className={styles.stepsGrid}>
            {steps.map((s) => (
              <div key={s.n} className={styles.stepCard}>
                <span className={styles.stepNum}>{s.n}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className={styles.features} id="features">
          <p className={styles.sectionLabel}>Platform</p>
          <h2 className={styles.sectionTitle}>Everything you need to automate calls</h2>
          <div className={styles.featuresGrid}>
            {features.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Stop missing calls.<br />Start deploying agents.</h2>
          <Link href="/dashboard" className={styles.primaryBtn}>
            Open the dashboard →
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <span className={styles.wordmark}>AIcaller</span>
        <span className={styles.footerNote}>© {new Date().getFullYear()} · Sahil Makandar</span>
      </footer>
    </div>
  );
}