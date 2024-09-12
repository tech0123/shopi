import "../../app/globals.css";
import "primeicons/primeicons.css";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import { Providers } from "@/store/providers";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-dark-cyan/theme.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shopi - Web App",
  description: "One Stop Solution For All Your Needs"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <SignedOut>
            <SignInButton />
            </SignedOut>
            <SignedIn>
            <UserButton />
            </SignedIn> */}
      <Providers>
        <ToastContainer theme="light" />
        <ClerkProvider>
          <body className={inter.className}>
            {children}
          </body>
        </ClerkProvider>
      </Providers>
    </html>
  );
}
