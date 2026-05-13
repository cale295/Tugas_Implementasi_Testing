"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // simulasi akun dari backend
  const customerUsername = "pelanggan";
  const customerPassword = "pelanggan123";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    // simulasi request API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (
      username === customerUsername &&
      password === customerPassword
    ) {
      // simulasi session/token
      localStorage.setItem(
        "auth",
        JSON.stringify({
          username,
          isLoggedIn: true,
        })
      );

      setMessage("Login berhasil");

      // redirect ke homepage
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      setMessage("Username atau password salah");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Customer Login
          </h1>

          <p className="text-zinc-400 mt-2">
            Login ke akun pelanggan
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm text-zinc-300 block mb-2">
              Username
            </label>

            <input
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300 block mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 transition rounded-xl py-3 text-black font-semibold disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {message && (
          <div className="mt-5 text-center text-sm text-zinc-300">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}