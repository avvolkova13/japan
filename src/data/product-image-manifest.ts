export type ProductImageEntry = {
  primary: string;
  secondary?: string;
  gallery?: readonly string[];
};

export const productImageManifest: Record<string, ProductImageEntry> = {
  "new-01": {
    primary: "/images/kanso/products/amaranth-dr-soie-labeled.png",
    secondary: "/images/kanso/products/amaranth-dr-soie-labeled.png",
    gallery: [
      "/images/kanso/products/amaranth-dr-soie-labeled.png",
      "/images/kanso/products/amaranth-dr-soie-lifestyle.png",
    ],
  },
  "new-02": {
    primary: "/images/kanso/products/direia-uv-cutout.png",
    secondary: "/images/kanso/products/direia-uv-labeled.png",
  },
  "new-03": { primary: "/images/kanso/products/quality-1st-cutout.png", secondary: "/images/kanso/products/quality-1st.png" },
  "new-04": { primary: "/images/kanso/products/tokio-home-cutout.png", secondary: "/images/kanso/products/tokio-home.png" },
  "best-01": { primary: "/images/kanso/products/spa-treatment-cutout.png", secondary: "/images/kanso/products/spa-treatment.png" },
  "best-02": {
    primary: "/images/kanso/products/enzym-cutout.png",
    secondary: "/images/kanso/products/enzym-cerad-labeled.jpg",
    gallery: [
      "/images/kanso/products/enzym-cutout.png",
      "/images/kanso/products/enzym-cerad-labeled.jpg",
    ],
  },
  "best-03": {
    primary: "/images/kanso/products/spa-treatment-exo-cutout.png",
    secondary: "/images/kanso/products/spa-treatment-exo-labeled.jpg",
    gallery: [
      "/images/kanso/products/spa-treatment-exo-cutout.png",
      "/images/kanso/products/spa-treatment-exo-labeled.jpg",
    ],
  },
  "best-04": { primary: "/images/kanso/products/tokio-oil-cutout.png", secondary: "/images/kanso/products/tokio-oil.png" },
  "best-05": { primary: "/images/kanso/products/tokio-treatment-cutout.png", secondary: "/images/kanso/products/tokio-treatment.png" },
  "face-01": { primary: "/images/kanso/products/face-01-cutout.png", secondary: "/images/kanso/products/face-01.png" },
  "face-02": { primary: "/images/kanso/products/face-02-cutout.png", secondary: "/images/kanso/products/face-02.png" },
  "hair-01": { primary: "/images/kanso/products/hair-01-cutout.png", secondary: "/images/kanso/products/hair-01.png" },
  "hair-02": { primary: "/images/kanso/products/hair-02-isolated.png", secondary: "/images/kanso/products/hair-02.png" },
  "body-01": { primary: "/images/kanso/products/body-01-isolated.png", secondary: "/images/kanso/products/body-01.png" },
  "wellness-01": { primary: "/images/kanso/products/wellness-01-isolated.png", secondary: "/images/kanso/products/wellness-01.png" },
  "wellness-02": { primary: "/images/kanso/products/wellness-02-isolated.png", secondary: "/images/kanso/products/wellness-02.png" },
  "wellness-03": { primary: "/images/kanso/products/wellness-03-isolated.png", secondary: "/images/kanso/products/wellness-03.png" },
  "wellness-04": { primary: "/images/kanso/products/wellness-04-isolated.png", secondary: "/images/kanso/products/wellness-04.png" },
  "wellness-05": { primary: "/images/kanso/products/wellness-05-isolated.png", secondary: "/images/kanso/products/wellness-05.png" },
  "wellness-06": { primary: "/images/kanso/products/wellness-06-isolated.png", secondary: "/images/kanso/products/wellness-06.png" },
};
