import React, { useEffect, useState } from "react";

const ScoreTable = () => {
  const [rmBlocks, setRmBlocks] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [resultsReady, setResultsReady] = useState(false);
  const [loading, setLoading] = useState(false);

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
      .catch((err) => {
        setLoading(false);
        console.error("Error al obtener /api/sheet:", err);
      });
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center p-4">
      {!resultsReady ? (
        loading && <p className="text-center">Cargando resultados...</p>
      ) : (
        <table className="border-3 rounded-lg border-yellow-600 w-full text-center text-sm bg-[url('/pergamino.png')] bg-cover">
          <thead>
            <tr>
              <th className="border-3 border-yellow-600 px-2 py-1">
                Rol Master
              </th>
              {rmBlocks.map((rm, idx) => (
                <th
                  key={idx}
                  colSpan={rm.colSpan}
                  className="border-3 border-yellow-600 px-2 py-1 text-center"
                >
                  {rm.name}
                </th>
              ))}
            </tr>
            <tr>
              <th className="border-3 border-yellow-600 px-2 py-1">
                Criterios
              </th>
              {criteria.map((c, idx) => (
                <th
                  key={idx}
                  className="border-3 border-yellow-600 px-2 py-1"
                >
                  {c}
                </th>
              ))}
            </tr>
            <tr>
              <th className="border-3 border-yellow-600 px-2 py-1">
                Participantes
              </th>
              {criteria.map((_, idx) => (
                <th key={idx} className="border-3 border-yellow-600"></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {participants.map((p, idx) => (
              <tr key={idx}>
                <td className="border-3 border-yellow-600 px-2 py-1 font-semibold">
                  {p.name}
                </td>
                {p.scores.map((score, i) => (
                  <td key={i} className="border-3 border-yellow-600 px-2 py-1">
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
