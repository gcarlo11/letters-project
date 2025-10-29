import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Caveat, Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" })
const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
// Inisialisasi Poppins
const _poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Pilih weight yang kamu butuhkan
  variable: "--font-poppins", // Definisikan CSS Variable
})

export const metadata: Metadata = {
  title: "Lettersforme",
  description: "Share heartfelt letters with songs",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_inter.variable} ${_caveat.variable} ${_poppins.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
