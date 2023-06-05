import SideNav from "@/components/layout/SideNav";
import "./globals.css";
import { Ubuntu } from "next/font/google";
import TopNav from "@/components/layout/TopNav";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "The 7 ERP",
  description: "The best user frindely and easy ERP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${ubuntu.className} bg-background`}>
        <div className="flex flex-row">
          <SideNav></SideNav>
          <div className="flex flex-col w-full lg:w-10/12 h-screen bg-background lg:px-10">
            <TopNav></TopNav>
            <div className="flex flex-1">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
