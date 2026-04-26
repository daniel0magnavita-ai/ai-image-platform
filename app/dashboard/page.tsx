"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      window.location.href = "/login";
      return;
    }

    setEmail(data.user.email || "");

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, credits")
      .eq("id", data.user.id)
      .single();

    if (profile) {
      setPlan(profile.plan);
      setCredits(profile.credits);
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="page">
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <div className="logo">Nowadays</div>
        <nav className="nav">
          <a href="/generate">Gerar</a>
          <a href="/gallery">Galeria</a>
          <a href="/plans">Planos</a>
          <button className="smallButton" onClick={logout}>Sair</button>
        </nav>
      </header>

      <section className="grid">
        <div className="card">
          <h2>Conta</h2>
          <p>{email}</p>
        </div>

        <div className="card">
          <h2>Plano</h2>
          <p>{plan}</p>
        </div>

        <div className="card">
          <h2>Créditos</h2>
          <p>{credits}</p>
        </div>
      </section>

      <section className="card" style={{ marginTop: 24 }}>
        <h2>Painel</h2>
        <p>Daqui o usuário acessa geração, galeria, planos e suporte.</p>
        <div className="row">
          <a className="linkButton" href="/generate">Gerar imagem</a>
          <a className="linkButton" href="/gallery">Ver galeria</a>
          <a className="linkButton" href="/plans">Ver planos</a>
        </div>
      </section>
    </main>
  );
}
