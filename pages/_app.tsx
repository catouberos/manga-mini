import "../styles/app.scss";
import NextNProgress from "nextjs-progressbar";
import { DefaultSeo } from "next-seo";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "@next/font/google";

const inter = Inter();

import SEO from "@data/next-seo";

export default function App({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <DefaultSeo
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            rel: "icon",
            href: "/favicon-16x16.png",
            sizes: "16x16",
            type: "image/png",
          },
          {
            rel: "apple-touch-icon",
            href: "/apple-touch-icon.png",
            sizes: "180x180",
          },
        ]}
        {...SEO}
      />
      <NextNProgress color="#fbea11" />
      <Component {...pageProps} />
      <Analytics />
    </div>
  );
}
