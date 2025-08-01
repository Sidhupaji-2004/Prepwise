import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Image from "next/image";
import { Toaster } from "sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Prepwise",
  description: "An AI powered platform for preparing for mock interviews",
};

export default function RootLayout({
  children,
}:{children : React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="root-layout">
          <nav>
            <Link href='/'>
              <Image 
                src='/logo.svg' 
                alt="Prepwise Logo" 
                height={32} 
                width={38}
                className="logo"
                />
              <h2 className="text-primary-100">Prepwise</h2>
            </Link>
          </nav>
          {children}
        </div>
      </body>
    </html>
    
  );
}
