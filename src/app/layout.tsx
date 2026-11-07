import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOOMERANG — Experience does not retire",
  description: "A fictional handover and practice demonstration.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
