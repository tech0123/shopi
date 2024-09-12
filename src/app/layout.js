import { Inter } from "next/font/google";
import "./globals.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.css";
import { Providers } from "@/store/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shopi - Web App",
  description: "One Stop Solution For All Your Needs"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
