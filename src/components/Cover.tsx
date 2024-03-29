import { cva, type VariantProps } from "class-variance-authority";
import Image, { type ImageLoaderProps } from "next/image";

export const imageEndpoint = process.env.NEXT_PUBLIC_IMAGE_ENDPOINT || "";

export const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return `${imageEndpoint}/${width}x0/filters:quality(${quality || 75})/${src}`;
};

const placeholderStyles = cva(
  `flex bg-zinc-200 p-6 text-zinc-500 aspect-[2/3] h-full w-full items-center justify-center text-center font-bold`,
  {
    variants: {
      hero: {
        true: "text-3xl",
        false: "text-xl",
      },
    },
    defaultVariants: {
      hero: false,
    },
  },
);

export interface CoverProps {
  entry: {
    name: string;
    image_url: string | null;
    id: string | number;
  };
  loader?: boolean;
  sizes?: string;
}

export interface Props
  extends CoverProps,
    VariantProps<typeof placeholderStyles> {}

export default function Cover({
  entry,
  hero,
  sizes = "(max-width: 768px) 50vw, (max-width: 1024px) 75vw, 100vw",
}: Props) {
  if (entry.image_url) {
    return (
      <Image
        loader={imageLoader}
        className="aspect-[2/3] h-full w-full object-cover"
        src={entry.image_url}
        alt={entry.name}
        width={300}
        height={450}
        sizes={sizes}
      />
    );
  } else {
    return <div className={placeholderStyles({ hero })}>{entry.name}</div>;
  }
}
