"use client";

import { useState } from "react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("anime");
  const [quantity, setQuantity] = useState("1");
  const [privateImage, setPrivateImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("");

  async function generateImage() {
    if (!prompt.trim()) {
      setStatus("Digite um prompt antes de gerar.");
      return;
    }

    setLoading(true);
    setStatus("Gerando imagem...");
    setImageUrl("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          style,
          quantity: Number(quantity),
          privateImage
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar imagem.");
      }

      setImageUrl(data.imageUrl);
      setStatus("Imagem gerada com sucesso.");
    } catch (error: any) {
      setStatus(error.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="header">
        <div className="logo">AI Image Platform</div>

        <nav className="nav">
          <a href="#gerar">Gerar</a>
          <a href="#planos">Planos</a>
          <a href="#galeria">Galeria</a>
          <a href="#suporte">Suporte</a>
        </nav>
      </header>

      <section className="hero">
        <div className="card">
          <span className="badge">Geração de imagens por IA</span>

          <h1>Crie imagens com IA direto pelo navegador.</h1>

          <p>
            Plataforma com geração por prompt, planos mensais, galeria de
            criações, imagens privadas para assinantes e suporte ao cliente.
          </p>

          <div className="grid">
            <div>
              <strong>Prompt</strong>
              <p>O cliente descreve a imagem que quer criar.</p>
            </div>

            <div>
              <strong>Planos</strong>
              <p>Créditos mensais e recursos extras para assinantes.</p>
            </div>

            <div>
              <strong>Galeria</strong>
              <p>As imagens ficam salvas na conta do usuário.</p>
            </div>
          </div>
        </div>

        <div className="card" id="gerar">
          <h2>Gerador</h2>

          <div className="generator">
            <textarea
              placeholder="Digite o prompt da imagem..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="row">
              <select value={style} onChange={(e) => setStyle(e.target.value)}>
                <option value="anime">Anime</option>
                <option value="realistic">Realista</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="fantasy">Fantasia</option>
                <option value="product">Produto</option>
              </select>

              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              >
                <option value="1">1 imagem</option>
                <option value="2">2 imagens</option>
                <option value="4">4 imagens</option>
              </select>
            </div>

            <label className="checkboxRow">
              <input
                type="checkbox"
                checked={privateImage}
                onChange={(e) => setPrivateImage(e.target.checked)}
              />
              Tornar imagem privada
            </label>

            <button onClick={generateImage} disabled={loading}>
              {loading ? "Gerando..." : "Gerar imagem"}
            </button>

            {status && <p className="muted">{status}</p>}

            <div className="preview">
              {imageUrl ? (
                <img src={imageUrl} alt="Imagem gerada" />
              ) : (
                <p className="muted">A imagem aparecerá aqui.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid" id="planos">
        <div className="card">
          <span className="badge">Inicial</span>
          <h2>Grátis</h2>
          <div className="price">R$0</div>
          <p>Teste básico com limite menor de gerações.</p>
        </div>

        <div className="card">
          <span className="badge">Popular</span>
          <h2>Básico</h2>
          <div className="price">R$19,90</div>
          <p>Créditos mensais, histórico e imagens privadas.</p>
        </div>

        <div className="card">
          <span className="badge">Avançado</span>
          <h2>Pro</h2>
          <div className="price">R$49,90</div>
          <p>Mais créditos, prioridade e mais gerações por mês.</p>
        </div>
      </section>

      <section className="grid" id="galeria">
        <div className="card">
          <h2>Galeria do usuário</h2>
          <p>
            Aqui ficarão disponíveis as imagens criadas por cada conta. Depois
            vamos conectar isso ao Supabase.
          </p>
        </div>

        <div className="card">
          <h2>Imagens privadas</h2>
          <p>
            Recurso liberado por plano. O usuário poderá deixar criações
            visíveis apenas para ele.
          </p>
        </div>

        <div className="card" id="suporte">
          <h2>Suporte</h2>
          <p>
            Aqui entraremos com chat de suporte, WhatsApp, e-mail ou tawk.to.
          </p>
        </div>
      </section>
    </main>
  );
}
