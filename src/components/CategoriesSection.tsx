export default function CategoriesSection() {
  return (
    <section className="bg-black/[0.03] px-5 py-16">
      <h2 className="text-center text-xs font-bold uppercase tracking-[0.3em] text-black/50">
        Categories
      </h2>
      <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border-2 border-black bg-white p-6 text-center">
          <p className="text-3xl font-black tracking-tight">3.0&ndash;4.49</p>
          <p className="mt-2 text-sm font-semibold text-black/60">Rating range</p>
        </div>
        <div className="rounded-2xl border-2 border-black bg-white p-6 text-center">
          <p className="text-3xl font-black tracking-tight">4.5&ndash;PRO</p>
          <p className="mt-2 text-sm font-semibold text-black/60">Rating range</p>
        </div>
        <div className="rounded-2xl border-2 border-black bg-accent p-6 text-center">
          <p className="text-2xl font-black tracking-tight sm:text-3xl">
            45+ Mixed Doubles
          </p>
          <p className="mt-2 text-sm font-semibold text-black/70">Bonus category</p>
        </div>
      </div>
    </section>
  );
}
