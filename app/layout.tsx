"use client";
import SideNav from "@/components/layout/SideNav";
import "./globals.css";
import { Ubuntu } from "next/font/google";
import TopNav from "@/components/layout/TopNav";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";

// Create a new instance of QueryClient
const queryClient = new QueryClient();
const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
        <title>Taswiqa</title>
      </head>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#0f62fe",
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <body className={`${ubuntu.className} bg-background `}>
            <div className="flex flex-row">
              <SideNav></SideNav>
              <div className="flex flex-col w-full lg:w-10/12 h-screen bg-background ">
                <TopNav></TopNav>
                <div className="flex flex-1 py-10 lg:px-10 cairoFont h-[90vh] overflow-y-auto">
                  {children}
                </div>
              </div>
            </div>
          </body>
        </QueryClientProvider>
      </ConfigProvider>
    </html>
  );
}
