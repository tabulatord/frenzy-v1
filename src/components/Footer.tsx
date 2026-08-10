import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 px-5 py-10 pb-24 sm:pb-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <span className="text-lg font-black tracking-tight">FPWC</span>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-black/60">
          <Link href="/privacy" className="hover:text-black">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-black">
            Terms
          </Link>
        </nav>
        <p className="text-xs text-black/40">Built on Solana</p>
        <p className="text-xs text-black/40">
          &copy; {new Date().getFullYear()} FPWC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
