import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Nav } from "@/components/nav";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "Cadence — Rotina de idiomas",
  description:
    "Companion sereno para rotina diária de estudo de idiomas. Timers por bloco, histórico, streak e modo foco — local-first.",
  applicationName: "Cadence",
  authors: [{ name: "Felipe Alirio Baruja" }],
  keywords: ["idiomas", "rotina", "timer", "estudo", "foco", "habit", "local-first"],
  openGraph: {
    title: "Cadence",
    description: "Rotina premium de estudo de idiomas, um bloco de cada vez.",
    type: "website",
    url: "https://cadence-ecru-three.vercel.app",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f2ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f10" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', dark);
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                  document.documentElement.classList.toggle('dark', e.matches);
                });
              } catch {}
            `,
          }}
        />
        <Providers>
          <div className="app-shell">
            <Nav />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
