"use client";

import { useEffect, useState } from "react";
import { PLAYER_COUNT_THRESHOLD, SHOW_PLAYER_COUNT } from "@/lib/config";

export default function PlayerCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!SHOW_PLAYER_COUNT) return;
    fetch("/api/stats")
      .then((r) => r.json())
      .then((body) => setCount(body.count))
      .catch(() => setCount(null));
  }, []);

  if (!SHOW_PLAYER_COUNT || count === null || count < PLAYER_COUNT_THRESHOLD) return null;

  return (
    <p className="text-center text-sm font-bold text-black/60">
      {count.toLocaleString()} players already on the Road to Paris 2027
    </p>
  );
}
