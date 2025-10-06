import { useEffect, useState } from "react";
import axios from "axios";

const VoteForm = ({ discordId, username }) => {
  const [participants, setParticipants] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await axios.get("/api/sheet");
        if (res.data.ready) {
          setParticipants(res.data.participants.map((p) => p.name));
        } else {
          setError("Los resultados aún no están listos para votar.");
        }
      } catch (err) {
        console.error(err);
        setError("Error al obtener participantes.");
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, []);

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
      console.error(err);
      setError(err.response?.data?.error || "Error al enviar el voto.");
    }
  };

  if (loading)
    return (
      <p className="text-center text-amber-100 font-serif">
        Cargando participantes...
      </p>
    );
  if (submitted)
    return (
      <p className="text-center text-green-400 font-serif font-semibold">
        ¡Gracias! Tu voto ha sido registrado.
      </p>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-black/40 border border-amber-100 rounded-xl shadow-xl p-6 text-amber-100 font-serif"
    >
      <h2 className="text-3xl font-bold mb-6 text-center drop-shadow-lg tracking-wide">
        Elegí a tu escritor favorto.
      </h2>

      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

      <div className="mb-6">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full border border-amber-100 px-3 py-2 rounded bg-black/30 text-amber-100"
        >
          <option value="">Selecciona...</option>
          {participants.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex justify-center">
        <button type="submit" className="drop-shadow-xl">
          <img
            src="/enviar-voto.svg"
            alt="Enviar Voto"
            className="w-[250px] hover:scale-105 transition-transform duration-300"
          />
        </button>
      </div>
    </form>
  );
};

export default VoteForm;
