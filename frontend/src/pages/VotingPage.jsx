import { useLocation, useNavigate } from "react-router-dom";
import VoteForm from "../components/VoteForm";

const VotingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const discordId = params.get("discordId");
  const username = params.get("username");

  console.log("VotingPage discordId desde URL:", discordId);

  if (!discordId) {
    console.warn("No hay discordId, redirigiendo al inicio...");
    navigate("/");
    return null;
  }

  return (
    <div
      className="min-h-screen bg-[url('/voting-bg.png')] bg-cover bg-center flex flex-col items-center justify-center px-6 py-12"
    >
      <div className="max-w-3xl w-full text-center text-amber-100 text-shadow-black text-shadow-lg drop-shadow-lg">
        <h1 className="text-6xl font-serif font-bold mb-4 tracking-wide">
          Buenas jurado {username}
        </h1>
        <p className="text-lg mb-8 font-medium">
          Aquí podés elegir el escrito que más te gustó según tu criterio. Recuerda que solo podrás votar una vez asi que te pedimos que leas todos los escritos antes de dar un veredicto final.
        </p>
      </div>

      <VoteForm discordId={discordId} username={username} />

      <button
        onClick={() => navigate("/")}
        className="mt-10 px-4 py-2 bg-amber-900/70 border border-amber-100 text-amber-100 font-serif rounded hover:bg-amber-100 hover:text-black transition"
      >
        ← Volver al inicio
      </button>
    </div>
  );
};

export default VotingPage;
