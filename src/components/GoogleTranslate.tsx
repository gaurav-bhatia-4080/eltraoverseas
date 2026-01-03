import { useCallback, useEffect } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
  }
}

const GoogleTranslate = () => {
  const initializeWidget = useCallback(() => {
    if (!(window as any).google?.translate?.TranslateElement) return;
    const container = document.getElementById("google_translate_element");
    if (!container) return;
    container.innerHTML = "";
    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,fr,de,hi",
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      },
      "google_translate_element",
    );
  }, []);

  useEffect(() => {
    window.googleTranslateElementInit = initializeWidget;

    const scriptId = "google-translate-script";
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existingScript) {
      if ((window as any).google?.translate?.TranslateElement) {
        initializeWidget();
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(script);
  }, [initializeWidget]);

  const changeLanguage = (code: string, retries = 5) => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;

    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }

    if (retries <= 0) {
      console.warn("Google Translate widget not ready");
      return;
    }

    initializeWidget();
    window.setTimeout(() => changeLanguage(code, retries - 1), 400);
  };

  return (
    <div className="flex items-center gap-2">
      <div id="google_translate_element" className="sr-only" />
      <Globe className="h-4 w-4 text-muted-foreground" />
      <div className="flex items-center gap-1">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant="ghost"
            size="icon"
            className="text-lg"
            onClick={() => changeLanguage(lang.code)}
            aria-label={`Translate to ${lang.label}`}
          >
            <span role="img" aria-hidden="true">
              {lang.flag}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GoogleTranslate;
