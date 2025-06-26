import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [bannerIndex, setBannerIndex] = useState(0);

  const banners = ["/banners/banner1.jpg", "/banners/banner2.jpg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && senha) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block flex-1">
        <img
          src={banners[bannerIndex]}
          alt="Banner"
          className="h-full w-full object-cover transition-opacity duration-1000"
        />
      </div>

      <div className="flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
        <div className="bg-[#0f172a] p-10 rounded-lg shadow-md w-[400px] border border-gray-700">
          <h1 className="text-white text-2xl font-semibold text-center mb-6">
            NexMoney
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-white block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@teste.com.br"
                className="w-full px-4 py-2 rounded bg-[#1e293b] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm text-white">Senha</label>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#1e293b] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded font-semibold"
            >
              Entrar
            </button>
          </form>
          <div className="text-center text-sm text-gray-400 mt-4">
            Não tem uma conta?{" "}
            <a href="/register" className="text-blue-400 hover:underline">
              Cadastre-se
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
