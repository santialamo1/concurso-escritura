import { useLocation, useNavigate } from "react-router-dom";
import VoteForm from "../components/VoteForm";

/* Sección: Página de votación */
const VotingPage = () => {
  // 🧩 Hooks de navegación y ubicación
  const navigate = useNavigate();
  const location = useLocation();

  // 🧩 Extracción de parámetros desde la URL
  const params = new URLSearchParams(location.search);
  const discordId = params.get("discordId");
  const username = params.get("username");

  // 🧩 Validación: si no hay discordId, redirigir
  if (!discordId) {
    navigate("/");
    return null;
  }

  /* Sección: Render principal */
  return (
    <div className="min-h-screen bg-[url('/voting-bg.png')] bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      {/* Encabezado ceremonial */}
      <div className="max-w-xl sm:max-w-2xl md:max-w-3xl w-full text-center text-amber-100 text-shadow-black text-shadow-lg drop-shadow-lg">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold mb-4 tracking-wide">
          Buenas jurado {username}
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-8 font-medium leading-relaxed">
          Aquí podés elegir el escrito que más te gustó según tu criterio. Recuerda que solo podrás votar una vez, así que te pedimos que leas todos los escritos antes de dar un veredicto final.
        </p>
      </div>

      {/* Formulario de votación */}
      <VoteForm discordId={discordId} username={username} />

      {/* Botón de regreso */}
      <button
        onClick={() => navigate("/")}
        className="mt-10 px-4 py-2 bg-amber-900/70 border border-amber-100 text-amber-100 font-serif rounded hover:bg-amber-100 hover:text-black transition text-sm sm:text-base"
      >
        ← Volver al inicio
      </button>
    </div>
  );
};

export default VotingPage;
