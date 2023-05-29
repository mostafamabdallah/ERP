import SideNav from "@/components/layout/SideNav";
import "./globals.css";
import { Ubuntu } from "next/font/google";

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
        </div>
      </body>
    </html>
  );
}
