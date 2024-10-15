import "../globals.css";
import "../scss/Style.scss";
import "primeicons/primeicons.css";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import { Providers } from "@/store/providers";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-dark-cyan/theme.css";
import ToastElement from "@/helper/CommonComponent/ToastElement";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shopi - Web App",
  description: "One Stop Solution For All Your Needs"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <div>
            <ToastElement />
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}
