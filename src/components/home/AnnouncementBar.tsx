import { X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useLanguage();

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground text-xs py-2 relative">
      <div className="container mx-auto px-4 text-center">
        <span>{t("announcement.freeDelivery")}</span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Close"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};