import React, { useEffect, useState } from "react";

export default function VotingResultsTable() {
  const [champion, setChampion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/api/votes")
      .then((r) => r.json())
      .then((data) => {
        setLoading(false);
        if (!data.ready) {
          setReady(false);
          return;
        }
        setReady(true);
        if (data.ranking && data.ranking.length > 0) {
          setChampion(data.ranking[0]);
        } else {
          setChampion(null);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error al obtener /api/votes:", err);
        setError("Error al cargar los votos.");
      });
  }, []);

  if (loading)
    return (
      <p className="text-center text-amber-100">
        Cargando votaciones...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-400">{error}</p>
    );
  if (!ready)
    return (
      <p className="text-center text-amber-300">
        Los resultados aún no están disponibles.
      </p>
    );

  return (
    <div
      className={`w-full max-w-md mx-auto text-center shadow-lg text-amber-100 rounded-xl border border-amber-100 bg-black/40 ${
        champion ? "p-4" : "p-6"
      }`}
    >
      {champion ? (
        <>
          <p className="text-sm text-amber-300 mb-2 italic">
            El pueblo ha elegido con claridad.
          </p>
          <p className="text-4xl font-bold tracking-wide drop-shadow-lg mb-2">
            {champion.name}
          </p>
          <p className="text-lg drop-shadow-sm">
            🗳️ Votos recibidos: <strong>{champion.votes}</strong>
          </p>
        </>
      ) : (
        <p className="text-2xl text-amber-300 drop-shadow">
          Aún no tenemos un campeón del pueblo.
        </p>
      )}
    </div>
  );
}
