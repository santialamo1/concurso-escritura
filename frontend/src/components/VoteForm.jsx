import { useEffect, useState } from "react";
import axios from "axios";

/* Sección: Formulario de votación */
const VoteForm = ({ discordId, username }) => {
  // 🧩 Estado: Participantes disponibles
  const [participants, setParticipants] = useState([]);

  // 🧩 Estado: Voto seleccionado
  const [selected, setSelected] = useState("");

  // 🧩 Estado: Carga, envío y errores
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  /* Sección: Carga de participantes al montar */
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await axios.get("/api/sheet");
        if (res.data.ready) {
          setParticipants(res.data.participants.map((p) => p.name));
        } else {
          setError("Los resultados aún no están listos para votar.");
        }
      } catch {
        setError("Error al obtener participantes.");
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, []);

  /* Sección: Envío del voto */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selected) {
      setError("Debes seleccionar un participante.");
      return;
    }

    if (!username) {
      setError("No se pudo obtener tu nombre de usuario de Discord.");
      return;
    }

    try {
      await axios.post("/api/vote", {
        discordId,
        username,
        vote: selected,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || "Error al enviar el voto.");
    }
  };

  /* Sección: Estados de carga y éxito */
  if (loading)
    return (
      <p className="text-center text-amber-100 font-serif text-sm sm:text-base">
        Cargando participantes...
      </p>
    );
  if (submitted)
    return (
      <p className="text-center text-green-400 font-serif font-semibold text-sm sm:text-base">
        ¡Gracias! Tu voto ha sido registrado.
      </p>
    );

  /* Sección: Render principal del formulario */
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl w-full mx-auto bg-black/40 border border-amber-100 rounded-xl shadow-xl p-4 sm:p-6 text-amber-100 font-serif"
    >
      {/* Título */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center drop-shadow-lg tracking-wide">
        Elegí a tu escritor favorito.
      </h2>

      {/* Mensaje de error */}
      {error && <p className="text-red-400 mb-4 text-center text-sm sm:text-base">{error}</p>}

      {/* Selector de participante */}
      <div className="mb-6">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full border border-amber-100 px-3 py-2 rounded bg-black/30 text-amber-100 text-sm sm:text-base"
        >
          <option value="">Selecciona...</option>
          {participants.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Botón de envío */}
      <div className="mt-4 flex justify-center">
        <button type="submit" className="drop-shadow-xl">
          <img
            src="/enviar-voto.svg"
            alt="Enviar Voto"
            className="w-[200px] sm:w-[250px] hover:scale-105 transition-transform duration-300"
          />
        </button>
      </div>
    </form>
  );
};

export default VoteForm;
