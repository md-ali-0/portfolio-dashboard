import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path: string | null | undefined): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    
    // Remove leading slash if it exists and join with base URL
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    
    return `${cleanBaseUrl}/${cleanPath}`;
}
