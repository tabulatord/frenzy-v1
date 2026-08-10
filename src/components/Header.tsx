export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-black/5 bg-white/90 px-5 py-4 backdrop-blur">
      <span className="text-lg font-black tracking-tight">FRENZY</span>
      <a
        href="#register"
        className="hidden rounded-full bg-black px-5 py-2 text-sm font-bold text-accent transition hover:bg-black/85 sm:inline-block"
      >
        PRE-REGISTER FREE
      </a>
    </header>
  );
}
