import "./globals.css";

export const metadata = {
  title: "AI Image Platform",
  description: "Plataforma de geração de imagens por IA"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
