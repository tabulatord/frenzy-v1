const STAGES = ["Local", "Regional", "National", "Paris 2027"];

export default function RoadSection() {
  return (
    <section className="bg-black px-5 py-16 text-white">
      <h2 className="text-center text-xs font-bold uppercase tracking-[0.3em] text-accent">
        The Road
      </h2>
      <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-2">
        {STAGES.map((stage, i) => (
          <div key={stage} className="flex items-center gap-3 sm:flex-col sm:gap-3">
            <div className="flex items-center gap-3 sm:flex-col">
              <span
                className={`text-lg font-black tracking-tight sm:text-xl ${
                  stage === "Paris 2027" ? "text-accent" : "text-white"
                }`}
              >
                {stage.toUpperCase()}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <span className="text-accent sm:mx-1" aria-hidden>
                <span className="sm:hidden">&darr;</span>
                <span className="hidden sm:inline">&rarr;</span>
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
