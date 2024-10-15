import "../globals.css";
import "../scss/Style.scss";
import "primeicons/primeicons.css";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import { Providers } from "@/store/providers";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shopi - Web App Auth",
  description: "One Stop Solution For All Your Needs"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <SignedOut>
            <SignInButton />
            </SignedOut>
            <SignedIn>
            <UserButton />
            </SignedIn> */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
