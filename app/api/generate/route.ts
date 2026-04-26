import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const prompt = body.prompt;
  const style = body.style || "anime";
  const privateImage = Boolean(body.privateImage);

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json(
      { error: "Prompt obrigatório." },
      { status: 400 }
    );
  }

  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#111827"/>
          <stop offset="50%" stop-color="#312e81"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#bg)"/>
      <circle cx="800" cy="210" r="120" fill="#6d5dfc" opacity="0.35"/>
      <circle cx="220" cy="790" r="180" fill="#f59e0b" opacity="0.18"/>
      <rect x="120" y="250" width="784" height="524" rx="36" fill="#020617" opacity="0.72"/>
      <text x="512" y="360" font-family="Arial" font-size="42" fill="#ffffff" text-anchor="middle" font-weight="700">
        Prévia da geração
      </text>
      <text x="512" y="435" font-family="Arial" font-size="28" fill="#cbd5e1" text-anchor="middle">
        Estilo: ${escapeXml(style)}
      </text>
      <text x="512" y="500" font-family="Arial" font-size="24" fill="#cbd5e1" text-anchor="middle">
        Privada: ${privateImage ? "sim" : "não"}
      </text>
      <foreignObject x="170" y="560" width="684" height="160">
        <div xmlns="http://www.w3.org/1999/xhtml" style="color:#e5e7eb;font-family:Arial;font-size:24px;text-align:center;line-height:1.35;">
          ${escapeXml(prompt).slice(0, 180)}
        </div>
      </foreignObject>
    </svg>
  `;

  const imageUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString(
    "base64"
  )}`;

  return NextResponse.json({
    imageUrl,
    prompt,
    style,
    privateImage
  });
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
