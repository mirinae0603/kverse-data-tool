import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Shadcn skeleton placeholder
import { ImageOff } from "lucide-react";

export function SafeImage({ src, alt,className,height='h-48' }: { src: string; alt?: string,className?:string,height?:string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative w-full ${height} flex items-center justify-center bg-muted rounded overflow-hidden ${className}`}>
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
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
