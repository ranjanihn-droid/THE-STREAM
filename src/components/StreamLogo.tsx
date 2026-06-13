import React from "react";

interface StreamLogoProps {
  className?: string;
  inverse?: boolean;
}

export default function StreamLogo({ className = "", inverse = false }: StreamLogoProps) {
  // Convert standard OneDrive share link to direct download link
  const sharingUrl = "https://1drv.ms/i/c/4dae11835575d5c1/IQRk2lquIovgQJVv1mzhRRJKAQnA_MsIYtlRS5q5Kkv03Tk";
  
  let directUrl = sharingUrl;
  try {
    const base64 = btoa(sharingUrl)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    directUrl = `https://api.onedrive.com/v1.0/shares/u!${base64}/root/content`;
  } catch (e) {
    console.error("Failed to generate OneDrive direct link", e);
  }

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={directUrl}
        alt="The Stream"
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
