import React, { useState, useEffect } from "react";

interface StreamLogoProps {
  className?: string;
  inverse?: boolean;
}

export default function StreamLogo({ className = "", inverse = false }: StreamLogoProps) {
  // Convert standard OneDrive share link to direct download link
  const sharingUrl = "https://1drv.ms/i/c/4dae11835575d5c1/IQRk2lquIovgQJVv1mzhRRJKAQnA_MsIYtlRS5q5Kkv03Tk";
  
  const [resolvedUrl, setResolvedUrl] = useState<string>(() => {
    try {
      const base64 = btoa(sharingUrl)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      return `https://api.onedrive.com/v1.0/shares/u!${base64}/root/content`;
    } catch {
      return sharingUrl;
    }
  });

  useEffect(() => {
    fetch(`/api/resolve-onedrive?url=${encodeURIComponent(sharingUrl)}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch resolved logo source");
        return res.json();
      })
      .then(data => {
        if (data.resolvedUrl) {
          setResolvedUrl(data.resolvedUrl);
        }
      })
      .catch(err => {
        console.warn("StreamLogo: falling back to client-side btoa resolver:", err);
      });
  }, [sharingUrl]);

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={resolvedUrl}
        alt="Chalkstream Educators"
        referrerPolicy="no-referrer"
        className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
        onError={(e) => {
          // Fallback if the dynamic direct-link fails
          if (e.currentTarget.src !== sharingUrl) {
            e.currentTarget.src = sharingUrl;
          }
        }}
      />
    </div>
  );
}
