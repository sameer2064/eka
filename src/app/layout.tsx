import type { Metadata }
from "next";

import "./globals.css";

export const metadata:
Metadata = {

  title:
    "EKA - Nepal’s Trusted Home Services Marketplace",

  description:
    "Find trusted plumbers, electricians, CCTV installers and verified home service professionals across Nepal.",

  keywords: [
    "Nepal home services",
    "plumber Nepal",
    "electrician Nepal",
    "CCTV installer Nepal",
    "home repair Nepal",
    "service marketplace Nepal",
  ],

  openGraph: {

    title:
      "EKA Marketplace",

    description:
      "Trusted verified home services across Nepal.",

    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">

      <body>
        {children}
      </body>

    </html>
  );
}