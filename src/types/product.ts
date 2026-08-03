export type ProductCategory =
  | "Face"
  | "Hair"
  | "Body"
  | "Sun Care"
  | "Wellness"
  | "Oral Care"
  | "Sets"
  | "Devices";

export type DemoProduct = {
  id: string;
  brand: string;
  name: string;
  category: ProductCategory;
  price: number;
  volume: string;
  image: string;
  hoverImage: string;
  galleryImages?: readonly string[];
  badge: string | null;
  description: string;
  available: boolean;
  availability: "catalog-preview";
};
