import ScoreTable from "../components/TableScores";

export default function ScorePage() {
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center bg-[url('/wood.png')] bg-cover bg-center">
      <h1
        className="text-6xl font-bold mb-8 text-center text-yellow-600 text-shadow-black text-shadow-lg drop-shadow-sm"
      >
        📜 Calificaciones completas
      </h1>

      <div className="w-full max-w-6xl px-6">
        <ScoreTable />
      </div>
    </main>
  );
}
