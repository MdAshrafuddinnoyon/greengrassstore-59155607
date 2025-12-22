import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  textAr: string;
  backgroundColor: string;
  textColor: string;
}

export const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState<AnnouncementSettings | null>(null);
  const { language, t } = useLanguage();
  const isArabic = language === "ar";

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'announcement_bar')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching announcement:', error);
          return;
        }

        if (data?.setting_value) {
          const announcementSettings = data.setting_value as unknown as AnnouncementSettings;
          setSettings(announcementSettings);
          setIsVisible(announcementSettings.enabled);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSettings();
  }, []);

  if (!isVisible || !settings?.enabled) return null;

  const displayText = isArabic ? (settings.textAr || settings.text) : settings.text;

  return (
    <div 
      className="text-xs py-2 relative"
      style={{ 
        backgroundColor: settings.backgroundColor || 'hsl(var(--primary))',
        color: settings.textColor || 'hsl(var(--primary-foreground))'
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <span>{displayText || t("announcement.freeDelivery")}</span>
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