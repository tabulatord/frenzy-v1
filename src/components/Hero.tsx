export default function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pt-14 pb-16 text-center sm:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/40 blur-3xl sm:h-96 sm:w-96"
      />
      <div className="relative mx-auto max-w-3xl">
        <h1 className="text-6xl font-black leading-[0.9] tracking-tight sm:text-8xl">
          FPWC
        </h1>
        <p className="mt-3 text-sm font-bold text-black/60 sm:text-base">
          Frenzy Pickleball World Championship
        </p>
        <p className="mt-2 text-sm font-bold uppercase tracking-[0.3em] text-black/70 sm:text-base">
          Road to Paris 2027
        </p>
        <p className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
          <span className="bg-accent px-2">$500,000</span>
          <br className="sm:hidden" /> PRIZE POOL
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black/60">
          🔗 Secured on the blockchain
        </span>

        <a
          href="#register"
          className="mt-10 inline-block rounded-full bg-black px-10 py-4 text-base font-extrabold text-accent shadow-[0_8px_0_0_rgba(0,0,0,0.15)] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none sm:text-lg"
        >
          PRE-REGISTER FREE
        </a>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-black/50">
          Free &bull; No payment required
        </p>
      </div>
    </section>
  );
}
