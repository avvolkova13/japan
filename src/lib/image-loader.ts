import { publicPath } from "@/lib/public-path";

type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function imageLoader({ src }: ImageLoaderProps) {
  return publicPath(src);
}
