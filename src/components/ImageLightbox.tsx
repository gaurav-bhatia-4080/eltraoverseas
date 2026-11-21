import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageLightboxProps = {
  images: string[];
  index: number;
  open: boolean;
  alt: string;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
};

const ZOOM_SCALE = 2.5;
const SWIPE_THRESHOLD = 50;

/**
 * Full-screen image viewer (Amazon-style): arrows / keyboard / swipe to move between images,
 * click or tap the image to zoom in and move the pointer to pan around it.
 */
const ImageLightbox = ({ images, index, open, alt, onOpenChange, onIndexChange }: ImageLightboxProps) => {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const touchStartX = useRef<number | null>(null);
  const hasMultiple = images.length > 1;

  useEffect(() => {
    setZoomed(false);
    setOrigin({ x: 50, y: 50 });
  }, [index, open]);

  const go = (delta: number) => {
    if (!hasMultiple) return;
    onIndexChange((index + delta + images.length) % images.length);
  };

  const updateOrigin = (element: HTMLElement, clientX: number, clientY: number) => {
    const rect = element.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setOrigin({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  };

  const current = images[index];
  if (!current) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-black/95 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[201] flex flex-col bg-black/95 text-white outline-none"
          onOpenAutoFocus={(event) => {
            // Focus the viewer itself (for arrow keys) instead of ringing the first button.
            event.preventDefault();
            (event.currentTarget as HTMLElement).focus();
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") go(-1);
            if (event.key === "ArrowRight") go(1);
          }}
        >
          <DialogPrimitive.Title className="sr-only">{alt}</DialogPrimitive.Title>

          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0">
            <span className="text-sm text-white/70">
              {hasMultiple ? `${index + 1} / ${images.length}` : ""}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomed((value) => !value)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
              >
                {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>
              <DialogPrimitive.Close
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Image stage */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 sm:px-16">
            <div
              className={cn(
                "relative h-full w-full overflow-hidden flex items-center justify-center select-none",
                zoomed ? "cursor-zoom-out" : "cursor-zoom-in",
              )}
              onClick={(event) => {
                updateOrigin(event.currentTarget, event.clientX, event.clientY);
                setZoomed((value) => !value);
              }}
              onMouseMove={(event) => {
                if (zoomed) updateOrigin(event.currentTarget, event.clientX, event.clientY);
              }}
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0].clientX;
              }}
              onTouchMove={(event) => {
                if (zoomed) updateOrigin(event.currentTarget, event.touches[0].clientX, event.touches[0].clientY);
              }}
              onTouchEnd={(event) => {
                const start = touchStartX.current;
                touchStartX.current = null;
                if (zoomed || start === null) return;
                const delta = event.changedTouches[0].clientX - start;
                if (Math.abs(delta) > SWIPE_THRESHOLD) {
                  event.preventDefault(); // don't treat a swipe as a tap-to-zoom
                  go(delta < 0 ? 1 : -1);
                }
              }}
            >
              <img
                src={current}
                alt={alt}
                draggable={false}
                className="h-full w-full object-contain transition-transform duration-200 ease-out"
                style={{
                  transform: zoomed ? `scale(${ZOOM_SCALE})` : "scale(1)",
                  transformOrigin: `${origin.x}% ${origin.y}%`,
                }}
              />
            </div>

            {hasMultiple && !zoomed && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {hasMultiple && (
            <div className="shrink-0 flex justify-center gap-2 px-4 py-4 overflow-x-auto">
              {images.map((image, imageIndex) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => onIndexChange(imageIndex)}
                  className={cn(
                    "shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                    imageIndex === index ? "border-accent opacity-100" : "border-transparent opacity-50 hover:opacity-90",
                  )}
                  aria-label={`Show image ${imageIndex + 1}`}
                  aria-current={imageIndex === index}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" draggable={false} />
                </button>
              ))}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default ImageLightbox;
