"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    await new Promise((resolve) =>
      setTimeout(resolve, 1500)
    );

    if (password !== confirmPassword) {
      setMessage("Password tidak sama");
      setLoading(false);
      return;
    }

    const existingUser =
      localStorage.getItem("customer");

    if (existingUser) {
      setMessage("User sudah terdaftar");
      setLoading(false);
      return;
    }

    localStorage.setItem(
      "customer",
      JSON.stringify({
        username,
        password,
      })
    );

    setMessage("Signup berhasil");

    setTimeout(() => {
      router.push("/login");
    }, 1000);

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white text-center">
          Create Account
        </h1>

        <p className="text-zinc-400 text-center mt-2">
          Register customer account
        </p>

        <form
          onSubmit={handleSignup}
          className="space-y-5 mt-8"
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 text-black py-3 rounded-xl font-bold hover:bg-cyan-400 transition"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-zinc-300 mt-5">
            {message}
          </p>
        )}

        <p className="text-zinc-500 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-400"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}