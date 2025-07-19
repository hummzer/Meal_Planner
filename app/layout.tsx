import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Fredoka } from "next/font/google"

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fredoka",
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${fredoka.className}`}>{children}</body>
    </html>
  )
}
