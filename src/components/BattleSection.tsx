const CONTINENTS = ["Americas", "Europe", "Asia"];

export default function BattleSection() {
  return (
    <section className="px-5 py-16 text-center">
      <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-black/50">
        Battle of 3 Continents
      </h2>
      <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {CONTINENTS.map((continent, i) => (
          <span key={continent} className="flex items-center gap-4">
            <span className="text-2xl font-black tracking-tight sm:text-4xl">
              {continent.toUpperCase()}
            </span>
            {i < CONTINENTS.length - 1 && (
              <span className="text-2xl font-black text-accent-dark sm:text-4xl">VS</span>
            )}
          </span>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-md text-lg font-semibold text-black/70">
        Which continent will take the trophy?
      </p>
    </section>
  );
}
