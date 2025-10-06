import React, { useEffect, useState } from "react";

const bordes = {
  1: "border-yellow-700",
  2: "border-gray-500",
  3: "border-orange-700",
};

const TopRolMasters = () => {
  const [top3, setTop3] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/api/sheet")
      .then((r) => r.json())
      .then((data) => {
        setLoading(false);
        if (!data.ready) {
          setError("Los resultados aún no están listos.");
          return;
        }

        const participantes = data.participants || [];

        const procesados = participantes.map((p) => {
          const puntajes = p.scores
            .map((s) => parseFloat(s))
            .filter((n) => !isNaN(n));

          const total = puntajes.reduce((acc, val) => acc + val, 0);
          const average = puntajes.length > 0 ? total / puntajes.length : 0;

          return {
            name: p.name,
            total: Math.round(total * 100) / 100,
            average: Math.round(average * 100) / 100,
          };
        });

        const ordenados = procesados
          .sort((a, b) => b.total - a.total)
          .slice(0, 3);

        setTop3(ordenados);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error al obtener /api/sheet:", err);
        setError("Error al cargar los datos.");
      });
  }, []);

  if (loading) return <p className="text-center">Cargando Top 3...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col md:flex-row gap-6 w-3xl justify-center items-stretch text-yellow-950">
      {top3.map((p, idx) => {
        const puesto = idx + 1;
        return (
          <div
            key={puesto}
            className={`flex-1 bg-[url('/pergamino.png')] bg-cover bg-center border-2 ${bordes[puesto]} p-4 py-7 border-4 rounded-lg shadow-lg`}
          >
            <h3 className="text-2xl font-grenze font-bold text-center mb-2">
              {puesto === 1
                ? "🥇 Primer Puesto"
                : puesto === 2
                ? "🥈 Segundo Puesto"
                : "🥉 Tercer Puesto"}
            </h3>
            <p className="text-center text-xl font-grenze">{p.name}</p>
            <p className="text-center text-lg font-grenze">Total: {p.total}</p>
            <p className="text-center text-lg font-grenze">Promedio: {p.average}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TopRolMasters;
