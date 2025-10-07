import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Shadcn skeleton placeholder
import { ImageOff } from "lucide-react";

export function SafeImage({ src, alt,className }: { src: string; alt?: string,className?:string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-muted rounded overflow-hidden ${className}`}>
      {/* Placeholder skeleton while loading */}
      {!isLoaded && !hasError && <Skeleton className="w-full h-full" />}

      {/* Fallback if image fails to load */}
      {hasError && (
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <ImageOff className="w-8 h-8 mb-2" />
          <span className="text-sm">Image unavailable</span>
        </div>
      )}

      {/* Actual image */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          crossOrigin="anonymous"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
