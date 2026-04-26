"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function handleAuth() {
    setStatus("Processando...");

    if (!email || !password) {
      setStatus("Preencha e-mail e senha.");
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        setStatus(error.message);
        return;
      }

      setStatus("Conta criada. Verifique seu e-mail, se o Supabase pedir confirmação.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="page authPage">
      <div className="card authCard">
        <h1>{mode === "login" ? "Entrar" : "Criar conta"}</h1>

        <p>
          Acesse sua conta para gerar imagens, ver créditos, planos e galeria.
        </p>

        <div className="generator">
          <input
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleAuth}>
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>

          <button
            className="secondaryButton"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login"
              ? "Não tenho conta"
              : "Já tenho conta"}
          </button>

          {status && <p className="muted">{status}</p>}
        </div>
      </div>
    </main>
  );
}
