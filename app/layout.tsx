"use client";
import SideNav from "@/components/layout/SideNav";
import "./globals.css";
import { Cairo } from "next/font/google";
import TopNav from "@/components/layout/TopNav";
import { ConfigProvider, theme as antTheme } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

const queryClient = new QueryClient();
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

function AppShell({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  const { antLocale } = useLanguage();

  return (
    <ConfigProvider
      locale={antLocale}
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? "#d09afa" : "#542582",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-row">
          <SideNav />
          <div className="flex flex-col w-full lg:w-10/12 h-screen bg-background dark:bg-surface transition-colors duration-300">
            <TopNav />
            <div className="flex flex-1 py-10 lg:px-10 h-[90vh] overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
        <title>تسويقة</title>
      </head>
      <body
        className={`${cairo.className} bg-background dark:bg-surface transition-colors duration-300`}
      >
        <LanguageProvider>
          <ThemeProvider>
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
