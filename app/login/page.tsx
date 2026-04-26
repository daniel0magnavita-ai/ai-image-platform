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

    if (password.length < 6) {
      setStatus("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/setup-profile`
        }
      });

      if (error) {
        setStatus(error.message);
        return;
      }

      setStatus("Conta criada. Verifique seu e-mail para confirmar o cadastro.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    if (!data.user) {
      setStatus("Não foi possível entrar.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", data.user.id)
      .single();

    if (!profile?.username) {
      window.location.href = "/setup-profile";
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="page authPage">
      <div className="card authCard">
        <h1>{mode === "login" ? "Entrar" : "Criar conta"}</h1>

        <p>
          Acesse sua conta para gerar imagens, ver créditos, planos, galeria e
          recursos privados.
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
            onClick={() => {
              setStatus("");
              setMode(mode === "login" ? "signup" : "login");
            }}
          >
            {mode === "login" ? "Não tenho conta" : "Já tenho conta"}
          </button>

          <a className="linkButton secondaryLink" href="/">
            Voltar para início
          </a>

          {status && <p className="muted">{status}</p>}
        </div>
      </div>
    </main>
  );
}
