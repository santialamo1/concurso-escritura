import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

/* Sección: Callback de autenticación Discord */
const AuthCallback = () => {
  // 🧩 Hooks de navegación y parámetros
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 🧩 Estado: Mensaje, datos y control de ejecución
  const [status, setStatus] = useState("Autenticando con Discord...");
  const [discordId, setDiscordId] = useState(null);
  const [username, setUsername] = useState(null);
  const hasRun = useRef(false);
  const hasNavigated = useRef(false);

  /* Sección: Validación y fetch inicial */
  useEffect(() => {
    if (hasRun.current) return;

    const alreadyProcessed = localStorage.getItem("discordAuthProcessed") === "true";
    const lastDiscordId = localStorage.getItem("lastDiscordId");
    const lastUsername = localStorage.getItem("lastUsername");

    // 🧩 Redirección directa si ya está autenticado
    if (alreadyProcessed && lastDiscordId && lastUsername) {
      hasRun.current = true;
      navigate(`/vote?discordId=${lastDiscordId}&username=${lastUsername}`, { replace: true });
      return;
    }

    const error = searchParams.get("error");
    const code = searchParams.get("code");

    // 🧩 Validación: usuario canceló
    if (error === "access_denied") {
      setStatus("Cancelaste la autenticación con Discord.");
      navigate("/cancelado", { replace: true });
      return;
    }

    // 🧩 Validación: falta código
    if (!code) {
      setStatus("Falta el código de autorización.");
      navigate("/", { replace: true });
      return;
    }

    hasRun.current = true;

    // 🧩 Fetch de datos desde backend
    const fetchDiscordData = async () => {
      try {
        const res = await axios.get(`/api/auth/discord/callback?code=${code}`);
        const id = res.data.discordId;
        const name = res.data.username;

        if (!id || !name) {
          setStatus("No se pudo obtener tus datos de Discord.");
          navigate("/", { replace: true });
          return;
        }

        setDiscordId(id);
        setUsername(name);
        setStatus("Redirigiendo a la votación...");
      } catch {
        setStatus("Error al autenticar con Discord.");
        navigate("/", { replace: true });
      }
    };

    fetchDiscordData();
  }, [searchParams, navigate]);

  /* Sección: Redirección final con datos */
  useEffect(() => {
    if (discordId && username && !hasNavigated.current) {
      hasNavigated.current = true;
      localStorage.setItem("discordAuthProcessed", "true");
      localStorage.setItem("lastDiscordId", discordId);
      localStorage.setItem("lastUsername", username);
      navigate(`/vote?discordId=${discordId}&username=${username}`, { replace: true });
    }
  }, [discordId, username, navigate]);

  /* Sección: Render principal */
  return (
    <div className="p-4 sm:p-6 text-center max-w-xl mx-auto">
      <p className="mb-2 font-grenze text-lg sm:text-xl">{status}</p>
      <pre className="text-xs sm:text-sm bg-gray-100 p-2 rounded text-left overflow-x-auto">
        Estado actual:
        {JSON.stringify({ status, discordId, username }, null, 2)}
      </pre>
    </div>
  );
};

export default AuthCallback;
