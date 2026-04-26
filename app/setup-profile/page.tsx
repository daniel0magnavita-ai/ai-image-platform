"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function SetupProfilePage() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("Carregando...");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      window.location.href = "/login";
      return;
    }

    setUserId(data.user.id);
    setEmail(data.user.email || "");

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, display_name, bio")
      .eq("id", data.user.id)
      .single();

    if (profile?.username) {
      window.location.href = "/dashboard";
      return;
    }

    setDisplayName(profile?.display_name || "");
    setBio(profile?.bio || "");
    setStatus("");
  }

  function cleanUsername(value: string) {
    return value
      .toLowerCase()
      .replace("@", "")
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 24);
  }

  async function saveProfile() {
    const clean = cleanUsername(username);

    if (!clean || clean.length < 3) {
      setStatus("Seu ID precisa ter pelo menos 3 caracteres.");
      return;
    }

    if (!displayName.trim()) {
      setStatus("Digite um nome de exibição.");
      return;
    }

    setSaving(true);
    setStatus("Salvando perfil...");

    const { error } = await supabase
      .from("profiles")
      .update({
        username: clean,
        display_name: displayName.trim(),
        bio: bio.trim()
      })
      .eq("id", userId);

    if (error) {
      if (error.message.includes("duplicate") || error.message.includes("unique")) {
        setStatus("Esse ID já está em uso. Escolha outro.");
      } else {
        setStatus(error.message);
      }

      setSaving(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="page authPage">
      <div className="card authCard">
        <h1>Crie seu perfil</h1>

        <p>
          Escolha seu ID público. Ele será usado no seu perfil, galeria,
          convites e identificação dentro da plataforma.
        </p>

        <div className="generator">
          <input
            value={email}
            disabled
            placeholder="E-mail"
          />

          <input
            value={username}
            onChange={(e) => setUsername(cleanUsername(e.target.value))}
            placeholder="Seu ID público. Ex: daniel_art"
          />

          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Nome de exibição. Ex: Daniel"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio opcional"
          />

          <button onClick={saveProfile} disabled={saving}>
            {saving ? "Salvando..." : "Salvar perfil"}
          </button>

          {status && <p className="muted">{status}</p>}
        </div>
      </div>
    </main>
  );
}
