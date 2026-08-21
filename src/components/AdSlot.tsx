"use client";

interface AdSlotProps {
  position: "header" | "footer" | "inline" | "sidebar";
  className?: string;
}

const adSizes = {
  header: "w-full max-w-[728px] h-[90px]",
  footer: "w-full max-w-[728px] h-[60px]",
  inline: "w-full max-w-[300px] sm:max-w-[728px] h-[90px] sm:h-[90px]",
  sidebar: "w-[160px] h-[600px]",
};

const adLabels = {
  header: "728×90 Banner Advertisement",
  footer: "728×60 Footer Ad",
  inline: "In-Content Advertisement",
  sidebar: "160×600 Skyscraper Ad",
};

export default function AdSlot({ position, className = "" }: AdSlotProps) {
  return (
    <div
      className={`ad-slot mx-auto ${adSizes[position]} ${className}`}
      data-ad-position={position}
    >
      <div className="flex flex-col items-center justify-center h-full gap-1">
        <span className="text-gray-600 text-[10px] uppercase tracking-wider font-medium">
          Advertisement
        </span>
        <span className="text-gray-700 text-[11px]">{adLabels[position]}</span>
        <span className="text-gray-800 text-[9px]">
          Place your ad network script here
        </span>
      </div>
    </div>
  );
}

// Pop-under ad trigger
export function triggerPopunder(adUrl = "https://your-ad-network.com/popunder") {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (w) {
    w.location.href = adUrl;
  }
}
