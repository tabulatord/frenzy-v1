export default function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 p-3 backdrop-blur sm:hidden">
      <a
        href="#register"
        className="block rounded-full bg-black py-3 text-center text-sm font-extrabold text-accent"
      >
        PRE-REGISTER FREE
      </a>
    </div>
  );
}
