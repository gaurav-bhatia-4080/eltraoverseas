import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** Classes for the placeholder shown when there is no image or it fails to load. */
  placeholderClassName?: string;
};

/** An <img> that shows a neutral placeholder instead of the browser's broken-image icon. */
const ProductImage = ({ src, alt, className, placeholderClassName, onError, ...props }: ProductImageProps) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "w-full h-full flex flex-col items-center justify-center gap-2 bg-secondary text-muted-foreground/60",
          placeholderClassName,
        )}
      >
        <ImageOff className="w-8 h-8" />
        <span className="text-xs font-medium">Image coming soon</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
      {...props}
    />
  );
};

export default ProductImage;
