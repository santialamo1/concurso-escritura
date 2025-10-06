import { Link } from "react-router-dom";

const Cancelado = () => {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-[url('/pergamino.png')] bg-cover bg-center text-parchment"
    >
      <h1 className="text-5xl font-grenze font-bold text-center drop-shadow-lg text-shadow-black">
        ⚠️ Autenticación cancelada
      </h1>

      <p className="text-xl font-grenze text-center max-w-xl text-shadow-black">
        No pudimos completar la autenticación con Discord. Si querés votar en el evento,
        necesitás iniciar sesión.
      </p>

      <Link
        to="/api/auth/discord"
        className="hover:scale-105 transition-transform duration-300"
      >
        <img
          src="/vota-ganador.svg"
          alt="Reintentar autenticación"
          className="w-[320px]"
        />
      </Link>
    </section>
  );
};

export default Cancelado;
