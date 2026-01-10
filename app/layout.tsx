import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { EditorProvider } from "@/app/contexts/EditorContext";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Your AI Doesn't Know Your Codebase (Yet)",
  description: "A Technical Workshop on Agent Engineering with Cursor",
};

export function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <EditorProvider>
          {children}
        </EditorProvider>
      </body>
    </html>
  );
}

export default RootLayout;
