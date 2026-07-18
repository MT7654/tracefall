import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tracefall — Autonomous incident investigation",
  description:
    "Tracefall reproduces broken customer journeys, tests competing hypotheses, and returns an evidence-backed incident report.",
  icons: { icon: "/brand/tracefall-logo.png" },
  openGraph: {
    title: "Tracefall",
    description: "Find where customer journeys break — and why.",
    images: ["/brand/tracefall-logo.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
