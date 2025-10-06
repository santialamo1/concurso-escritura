import { Link } from "react-router-dom";
import TopRolMasters from "../components/TopRolMasters";
import VotingResultsTable from "../components/VotingResultsTable";

export default function MainMenu() {
  return (
    <main className="h-screen w-full overflow-y-scroll scroll-smooth snap-y snap-mandatory">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen snap-start flex flex-col justify-center items-center gap-6 p-8 bg-[url('/fondo-hero.png')] bg-cover bg-center text-parchment text-yellow-600"
      >
        <div className="absolute inset-0 bg-black opacity-40 z-0" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h1 className="text-8xl font-bold text-center drop-shadow-lg text-shadow-black text-shadow-lg">
            Concurso de Escritura ImperiumAO
          </h1>

          <p className="text-center max-w-2xl text-2xl text-shadow-black text-shadow-sm">
            Bienvenido al concurso de escritura. Aquí podrás ver los puntajes de
            los RM, votar por tu favorito y explorar los resultados del evento.
          </p>
        </div>
      </section>

      {/* Separador visual */}
      <div className="h-16 w-full bg-gradient-to-b from-transparent to-[#3f2e1e]" />

      {/* Sección: Ganadores por puntuación */}
      <section
        id="rolmasters"
        className="min-h-screen snap-start flex flex-col items-center justify-center gap-16 p-8 bg-[url('/wood.png')] bg-cover bg-center bg-no-repeat"
      >
        <h2 className="text-6xl font-bold drop-shadow-sm text-center tracking-wide text-stone-100 text-shadow-black text-shadow-lg">
          🏆 Ganadores por puntuación
        </h2>

        <TopRolMasters />

        <Link to="/scores" className="block w-fit mx-auto mt-6">
          <img
            src="/calificaciones.svg"
            alt="Ver todas las calificaciones"
            className="w-[320px] hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </section>

      {/* Separador visual */}
      <div className="h-16 w-full bg-gradient-to-b from-transparent to-[#3f2e1e]" />

      {/* Sección: Campeón del Pueblo */}
      <section
        id="campeon"
        className="min-h-screen snap-start flex flex-col items-center justify-center gap-10 px-8 py-16 bg-[url('/champion-bg.png')] bg-cover bg-center text-amber-100"
      >
        <h2 className="text-6xl font-bold drop-shadow-lg text-center tracking-wide text-shadow-black text-shadow-lg">
          👑 Campeón del Pueblo
        </h2>

        <p className="text-center max-w-2xl text-xl leading-relaxed drop-shadow-md">
          El pueblo ha hablado. Aquí están los resultados de la votación
          popular.
        </p>

        <VotingResultsTable />

        <a
          href="http://localhost:4000/api/auth/discord"
          className="block w-fit mx-auto mt-8 drop-shadow-xl"
        >
          <img
            src="/vota-ganador.svg"
            alt="Votar por el ganador del pueblo"
            className="w-[320px] hover:scale-105 transition-transform duration-300"
          />
        </a>
      </section>
    </main>
  );
}
