import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import ContextProvider from "@/context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <div className={`${inter.className}`}>
        <Component {...pageProps} />
      </div>
    </ContextProvider>
  );
}
