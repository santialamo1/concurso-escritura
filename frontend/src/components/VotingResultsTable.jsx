import React, { useEffect, useState } from "react";

/* Sección: Tabla de resultados de votación popular */
export default function VotingResultsTable() {
  // 🧩 Estado: Campeón actual
  const [champion, setChampion] = useState(null);

  // 🧩 Estado: Carga y disponibilidad
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  /* Sección: Efecto de carga inicial */
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
      .catch(() => {
        setLoading(false);
        setError("Error al cargar los votos.");
      });
  }, []);

  /* Sección: Estados de carga y error */
  if (loading)
    return (
      <p className="text-center text-amber-100 text-sm sm:text-base">
        Cargando votaciones...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-400 text-sm sm:text-base">{error}</p>
    );
  if (!ready)
    return (
      <p className="text-center text-amber-300 text-sm sm:text-base">
        Los resultados aún no están disponibles.
      </p>
    );

  /* Sección: Render principal */
  return (
    <div
      className={`w-full max-w-md mx-auto text-center shadow-lg text-amber-100 rounded-xl border border-amber-100 bg-black/40 ${
        champion ? "p-4 sm:p-6" : "p-6 sm:p-8"
      }`}
    >
      {champion ? (
        <>
          {/* Mensaje ceremonial */}
          <p className="text-xs sm:text-sm text-amber-300 mb-2 italic">
            El pueblo ha elegido con claridad.
          </p>

          {/* Nombre del campeón */}
          <p className="text-3xl sm:text-4xl font-bold tracking-wide drop-shadow-lg mb-2">
            {champion.name}
          </p>

          {/* Votos recibidos */}
          <p className="text-base sm:text-lg drop-shadow-sm">
            🗳️ Votos recibidos: <strong>{champion.votes}</strong>
          </p>
        </>
      ) : (
        /* Mensaje cuando no hay campeón */
        <p className="text-xl sm:text-2xl text-amber-300 drop-shadow">
          Aún no tenemos un campeón del pueblo.
        </p>
      )}
    </div>
  );
}
