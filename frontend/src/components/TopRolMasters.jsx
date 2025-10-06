import React, { useEffect, useState } from "react";

/* Sección: Colores de borde por puesto */
const bordes = {
  1: "border-yellow-700",
  2: "border-gray-500",
  3: "border-orange-700",
};

/* Sección: Top 3 Rol Masters por puntaje total */
const TopRolMasters = () => {
  // 🧩 Estado: Top 3 participantes
  const [top3, setTop3] = useState([]);

  // 🧩 Estado: Carga y error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Sección: Efecto de carga inicial */
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

        // 🧩 Procesamiento de puntajes
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

        // 🧩 Ordenar por total y tomar top 3
        const ordenados = procesados
          .sort((a, b) => b.total - a.total)
          .slice(0, 3);

        setTop3(ordenados);
      })
      .catch(() => {
        setLoading(false);
        setError("Error al cargar los datos.");
      });
  }, []);

  /* Sección: Render de estados */
  if (loading) return <p className="text-center text-sm sm:text-base">Cargando Top 3...</p>;
  if (error) return <p className="text-center text-red-500 text-sm sm:text-base">{error}</p>;

  /* Sección: Render principal */
  return (
    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-5xl mx-auto justify-center items-stretch text-yellow-950 px-4">
      {top3.map((p, idx) => {
        const puesto = idx + 1;
        return (
          <div
            key={puesto}
            className={`flex-1 bg-[url('/pergamino.png')] bg-cover bg-center border-2 ${bordes[puesto]} p-4 sm:p-6 border-4 rounded-lg shadow-lg`}
          >
            {/* Título del puesto */}
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">
              {puesto === 1
                ? "🥇 Primer Puesto"
                : puesto === 2
                ? "🥈 Segundo Puesto"
                : "🥉 Tercer Puesto"}
            </h3>

            {/* Datos del participante */}
            <p className="text-center text-lg sm:text-xl font-grenze">{p.name}</p>
            <p className="text-center text-base sm:text-lg font-grenze">Total: {p.total}</p>
            <p className="text-center text-base sm:text-lg font-grenze">Promedio: {p.average}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TopRolMasters;
