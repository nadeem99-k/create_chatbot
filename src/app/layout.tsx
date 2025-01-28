import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes';

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Chat Assistant",
  description: "An intelligent chat assistant that adapts to different roles and languages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className} suppressHydrationWarning>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark"
          enableSystem={false}
        >
          <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
