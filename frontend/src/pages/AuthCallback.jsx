import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Autenticando con Discord...");
  const [discordId, setDiscordId] = useState(null);
  const [username, setUsername] = useState(null);
  const hasRun = useRef(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    console.log("[AuthCallback] useEffect iniciado");

    if (hasRun.current) {
      console.log("[AuthCallback] hasRun ya está en true, abortando");
      return;
    }

    const alreadyProcessed = localStorage.getItem("discordAuthProcessed") === "true";
    const lastDiscordId = localStorage.getItem("lastDiscordId");
    const lastUsername = localStorage.getItem("lastUsername");

    if (alreadyProcessed && lastDiscordId && lastUsername) {
      console.log("[AuthCallback] Ya autenticado, redirigiendo directamente");
      hasRun.current = true;
      navigate(`/vote?discordId=${lastDiscordId}&username=${lastUsername}`, { replace: true });
      return;
    }

    const error = searchParams.get("error");
    const code = searchParams.get("code");

    if (error === "access_denied") {
      console.warn("[AuthCallback] Usuario canceló la autorización en Discord");
      setStatus("Cancelaste la autenticación con Discord.");
      navigate("/cancelado", { replace: true });
      return;
    }

    if (!code) {
      console.warn("[AuthCallback] No hay código en la URL");
      setStatus("Falta el código de autorización.");
      navigate("/", { replace: true });
      return;
    }

    hasRun.current = true;

    const fetchDiscordData = async () => {
      try {
        console.log("[AuthCallback] Llamando al backend con code:", code);
        const res = await axios.get(`/api/auth/discord/callback?code=${code}`);
        console.log("[AuthCallback] Respuesta del backend:", res.data);

        const id = res.data.discordId;
        const name = res.data.username;

        if (!id || !name) {
          console.error("[AuthCallback] No se recibió discordId o username");
          setStatus("No se pudo obtener tus datos de Discord.");
          navigate("/", { replace: true });
          return;
        }

        console.log("[AuthCallback] discordId y username recibidos:", id, name);
        setDiscordId(id);
        setUsername(name);
        setStatus("Redirigiendo a la votación...");
      } catch (err) {
        console.error("[AuthCallback] Error en la autenticación:", err.response?.data || err);
        setStatus("Error al autenticar con Discord.");
        navigate("/", { replace: true });
      }
    };

    fetchDiscordData();
  }, [searchParams, navigate]);

  useEffect(() => {
    if (discordId && username && !hasNavigated.current) {
      console.log("[AuthCallback] Ejecutando navigate a /vote con discordId y username:", discordId, username);
      hasNavigated.current = true;
      localStorage.setItem("discordAuthProcessed", "true");
      localStorage.setItem("lastDiscordId", discordId);
      localStorage.setItem("lastUsername", username);
      navigate(`/vote?discordId=${discordId}&username=${username}`, { replace: true });
    }
  }, [discordId, username, navigate]);

  return (
    <div className="p-4 text-center">
      <p className="mb-2 font-grenze text-xl">{status}</p>
      <pre className="text-xs bg-gray-100 p-2 rounded text-left">
        Estado actual:
        {JSON.stringify({ status, discordId, username }, null, 2)}
      </pre>
    </div>
  );
};

export default AuthCallback;
