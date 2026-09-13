import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIRROR_PALETTE — 色とシルエットのコーデ帳",
  description:
    "服の形を選んで、好きな色をひとつずつ。HEXカラーとシルエットで組み合わせを試せる、シンプルなカラーコーデアプリ。",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
