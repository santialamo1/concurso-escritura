import ScoreTable from "../components/TableScores";

/* Sección: Página de calificaciones completas */
export default function ScorePage() {
  return (
    <main className="min-h-screen w-screen flex flex-col justify-center items-center bg-[url('/wood.png')] bg-cover bg-center py-8">
      {/* Título principal */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-8 text-center text-yellow-600 text-shadow-black text-shadow-lg drop-shadow-sm">
        📜 Calificaciones completas
      </h1>

      {/* Tabla de puntajes */}
      <div className="w-full">
        <ScoreTable />
      </div>
    </main>
  );
}
