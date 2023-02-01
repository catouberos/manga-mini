import type { DefaultSeoProps } from "next-seo";

export const seoConfig: DefaultSeoProps = {
  titleTemplate: "%s - Truyện Bản Quyền",
  defaultTitle: "Truyện Bản Quyền",
  themeColor: "#2684ff",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Truyện Bản Quyền",
  },
};

// Currency formatter
export const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
