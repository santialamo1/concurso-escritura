import React, { useEffect, useState } from "react";

/* Sección: Tabla de puntajes por criterios y RM */
const ScoreTable = () => {
  // 🧩 Estado: Datos del spreadsheet
  const [rmBlocks, setRmBlocks] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [participants, setParticipants] = useState([]);

  // 🧩 Estado: Control de carga y disponibilidad
  const [resultsReady, setResultsReady] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Sección: Efecto de carga inicial */
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/api/sheet")
      .then((r) => r.json())
      .then((data) => {
        setLoading(false);
        if (!data.ready) {
          setResultsReady(false);
          return;
        }
        setResultsReady(true);
        setRmBlocks(data.rmBlocks);
        setCriteria(data.criteria);
        setParticipants(data.participants);
      })
      .catch(() => {
        setLoading(false);
        // Error silenciado
      });
  }, []);

  /* Sección: Render principal */
  return (
    <div className="w-full h-full flex justify-center items-center p-4 overflow-x-auto">
      {/* Estado: Cargando */}
      {!resultsReady ? (
        loading && <p className="text-center text-sm sm:text-base">Cargando resultados...</p>
      ) : (
        /* Sección: Tabla de resultados */
        <table className="min-w-[640px] sm:min-w-full border-3 rounded-lg border-yellow-600 text-center text-xs sm:text-sm bg-[url('/pergamino.png')] bg-cover">
          <thead>
            {/* Fila: Encabezado RM */}
            <tr>
              <th className="border-3 border-yellow-600 px-2 py-1 whitespace-nowrap">
                Rol Master
              </th>
              {rmBlocks.map((rm, idx) => (
                <th
                  key={idx}
                  colSpan={rm.colSpan}
                  className="border-3 border-yellow-600 px-2 py-1 text-center whitespace-nowrap"
                >
                  {rm.name}
                </th>
              ))}
            </tr>

            {/* Fila: Encabezado criterios */}
            <tr>
              <th className="border-3 border-yellow-600 px-2 py-1 whitespace-nowrap">
                Criterios
              </th>
              {criteria.map((c, idx) => (
                <th
                  key={idx}
                  className="border-3 border-yellow-600 px-2 py-1 whitespace-nowrap"
                >
                  {c}
                </th>
              ))}
            </tr>

            {/* Fila: Encabezado participantes */}
            <tr>
              <th className="border-3 border-yellow-600 px-2 py-1 whitespace-nowrap">
                Participantes
              </th>
              {criteria.map((_, idx) => (
                <th key={idx} className="border-3 border-yellow-600"></th>
              ))}
            </tr>
          </thead>

          {/* Cuerpo: Puntajes por participante */}
          <tbody>
            {participants.map((p, idx) => (
              <tr key={idx}>
                <td className="border-3 border-yellow-600 px-2 py-1 font-semibold whitespace-nowrap">
                  {p.name}
                </td>
                {p.scores.map((score, i) => (
                  <td key={i} className="border-3 border-yellow-600 px-2 py-1 whitespace-nowrap">
                    {score}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScoreTable;
