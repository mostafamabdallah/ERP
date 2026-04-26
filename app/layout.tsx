"use client";
import SideNav from "@/components/layout/SideNav";
import "./globals.css";
import { Ubuntu } from "next/font/google";
import TopNav from "@/components/layout/TopNav";
import { ConfigProvider, theme as antTheme } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

const queryClient = new QueryClient();
const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: "400",
});

function AppShell({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  return (
    <ConfigProvider
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
            <div className="flex flex-1 py-10 lg:px-10 cairoFont h-[90vh] overflow-y-auto">
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
        <title>Taswiqa</title>
      </head>
      <body
        className={`${ubuntu.className} bg-background dark:bg-surface transition-colors duration-300`}
      >
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
