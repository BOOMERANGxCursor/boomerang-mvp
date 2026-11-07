import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOOMERANG — Experience does not retire",
  description: "Capture experience, review knowledge, and build a memory worth passing on.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
