import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type SiteSettings = Tables<"site_settings">;

let cachedSettings: SiteSettings | null = null;
let listeners: Array<(s: SiteSettings) => void> = [];

const notifyListeners = (s: SiteSettings) => {
  cachedSettings = s;
  listeners.forEach((fn) => fn(s));
};

let fetching = false;
const fetchSettings = async () => {
  if (fetching) return;
  fetching = true;
  const { data } = await supabase.from("site_settings").select("*").limit(1).single();
  fetching = false;
  if (data) notifyListeners(data);
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(cachedSettings);

  useEffect(() => {
    const handler = (s: SiteSettings) => setSettings(s);
    listeners.push(handler);
    if (!cachedSettings) fetchSettings();
    return () => {
      listeners = listeners.filter((l) => l !== handler);
    };
  }, []);

  return settings;
};
