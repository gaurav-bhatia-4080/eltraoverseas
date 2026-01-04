import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const languages = [
  { code: "af", label: "Afrikaans" },
  { code: "sq", label: "Albanian" },
  { code: "am", label: "Amharic" },
  { code: "ar", label: "Arabic" },
  { code: "hy", label: "Armenian" },
  { code: "az", label: "Azerbaijani" },
  { code: "eu", label: "Basque" },
  { code: "be", label: "Belarusian" },
  { code: "bn", label: "Bengali" },
  { code: "bs", label: "Bosnian" },
  { code: "bg", label: "Bulgarian" },
  { code: "ca", label: "Catalan" },
  { code: "ceb", label: "Cebuano" },
  { code: "ny", label: "Chichewa" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
  { code: "zh-TW", label: "Chinese (Traditional)" },
  { code: "co", label: "Corsican" },
  { code: "hr", label: "Croatian" },
  { code: "cs", label: "Czech" },
  { code: "da", label: "Danish" },
  { code: "nl", label: "Dutch" },
  { code: "en", label: "English" },
  { code: "eo", label: "Esperanto" },
  { code: "et", label: "Estonian" },
  { code: "fi", label: "Finnish" },
  { code: "fr", label: "French" },
  { code: "fy", label: "Frisian" },
  { code: "gl", label: "Galician" },
  { code: "ka", label: "Georgian" },
  { code: "de", label: "German" },
  { code: "el", label: "Greek" },
  { code: "gu", label: "Gujarati" },
  { code: "ht", label: "Haitian Creole" },
  { code: "ha", label: "Hausa" },
  { code: "haw", label: "Hawaiian" },
  { code: "iw", label: "Hebrew" },
  { code: "hi", label: "Hindi" },
  { code: "hmn", label: "Hmong" },
  { code: "hu", label: "Hungarian" },
  { code: "is", label: "Icelandic" },
  { code: "ig", label: "Igbo" },
  { code: "id", label: "Indonesian" },
  { code: "ga", label: "Irish" },
  { code: "it", label: "Italian" },
  { code: "ja", label: "Japanese" },
  { code: "jw", label: "Javanese" },
  { code: "kn", label: "Kannada" },
  { code: "kk", label: "Kazakh" },
  { code: "km", label: "Khmer" },
  { code: "ko", label: "Korean" },
  { code: "ku", label: "Kurdish" },
  { code: "ky", label: "Kyrgyz" },
  { code: "lo", label: "Lao" },
  { code: "la", label: "Latin" },
  { code: "lv", label: "Latvian" },
  { code: "lt", label: "Lithuanian" },
  { code: "lb", label: "Luxembourgish" },
  { code: "mk", label: "Macedonian" },
  { code: "mg", label: "Malagasy" },
  { code: "ms", label: "Malay" },
  { code: "ml", label: "Malayalam" },
  { code: "mt", label: "Maltese" },
  { code: "mi", label: "Maori" },
  { code: "mr", label: "Marathi" },
  { code: "mn", label: "Mongolian" },
  { code: "my", label: "Myanmar" },
  { code: "ne", label: "Nepali" },
  { code: "no", label: "Norwegian" },
  { code: "ps", label: "Pashto" },
  { code: "fa", label: "Persian" },
  { code: "pl", label: "Polish" },
  { code: "pt", label: "Portuguese" },
  { code: "pa", label: "Punjabi" },
  { code: "ro", label: "Romanian" },
  { code: "ru", label: "Russian" },
  { code: "sm", label: "Samoan" },
  { code: "gd", label: "Scots Gaelic" },
  { code: "sr", label: "Serbian" },
  { code: "st", label: "Sesotho" },
  { code: "sn", label: "Shona" },
  { code: "sd", label: "Sindhi" },
  { code: "si", label: "Sinhala" },
  { code: "sk", label: "Slovak" },
  { code: "sl", label: "Slovenian" },
  { code: "so", label: "Somali" },
  { code: "es", label: "Spanish" },
  { code: "su", label: "Sundanese" },
  { code: "sw", label: "Swahili" },
  { code: "sv", label: "Swedish" },
  { code: "tl", label: "Tagalog" },
  { code: "tg", label: "Tajik" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "th", label: "Thai" },
  { code: "tr", label: "Turkish" },
  { code: "uk", label: "Ukrainian" },
  { code: "ur", label: "Urdu" },
  { code: "uz", label: "Uzbek" },
  { code: "vi", label: "Vietnamese" },
  { code: "cy", label: "Welsh" },
  { code: "xh", label: "Xhosa" },
  { code: "yi", label: "Yiddish" },
  { code: "yo", label: "Yoruba" },
  { code: "zu", label: "Zulu" }
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
  }
}

const flagOverrides: Record<string, string> = {
  "en": "gb",
  "iw": "il",
  "zh-CN": "cn",
  "zh-TW": "tw",
  "pt": "pt",
  "es": "es",
  "ga": "ie",
  "sr": "rs",
  "uk": "ua",
  "fa": "ir",
  "pa": "in",
  "bn": "bd",
  "hi": "in",
  "ta": "in",
  "te": "in",
  "ar": "ae",
  "ms": "my",
  "sw": "ke",
  "pt-BR": "br",
};

const getFlagCode = (code: string) => {
  if (flagOverrides[code]) return flagOverrides[code];
  const base = code.includes("-") ? code.split("-")[0] : code;
  return base.length === 2 ? base : null;
};

const FloatingTranslate = () => {
  const [selected, setSelected] = useState("en");
  const [sheetOpen, setSheetOpen] = useState(false);

  const initializeWidget = () => {
    if (!(window as any).google?.translate?.TranslateElement) return;
    const container = document.getElementById("google_translate_element");
    if (!container) return;
    container.innerHTML = "";
    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: languages.map((lang) => lang.code).join(","),
        autoDisplay: false,
      },
      "google_translate_element",
    );
  };

  useEffect(() => {
    window.googleTranslateElementInit = initializeWidget;
    const scriptId = "google-translate-script";
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existing) {
      if ((window as any).google?.translate?.TranslateElement) {
        initializeWidget();
      }
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const changeLanguage = (code: string, retries = 5) => {
    setSelected(code);
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }
    if (retries <= 0) return;
    setTimeout(() => changeLanguage(code, retries - 1), 400);
  };

  return (
    <div className="fixed right-4 z-40 space-y-3 top-16 md:top-24">
      <div className="rounded-full bg-white/90 backdrop-blur border border-border shadow-lg px-4 py-2 hidden md:flex items-center gap-2 text-sm text-foreground">
        <span className="font-medium hidden lg:inline">Translate:</span>
        <Select value={selected} onValueChange={(value) => changeLanguage(value)}>
          <SelectTrigger className="w-48 h-8 border border-transparent bg-white/0 px-2 text-sm font-semibold focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
          <SelectContent className="max-h-72">
            {languages.map((lang) => (
              <SelectItem
                key={lang.code}
                value={lang.code}
                className="flex items-center gap-2 data-[state=checked]:bg-accent/20 data-[state=checked]:text-foreground"
              >
                <div className="flex items-center gap-2">
                  {(() => {
                    const flagCode = getFlagCode(lang.code);
                    return flagCode ? (
                      <img
                        src={`https://flagcdn.com/24x18/${flagCode.toLowerCase()}.png`}
                        alt=""
                        className="w-4 h-3 rounded-sm object-cover"
                        loading="lazy"
                      />
                    ) : null;
                  })()}
                  <span>{lang.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="md:hidden flex justify-end">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button size="icon" className="rounded-full shadow-lg" variant="accent">
              <Globe className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-3/4 overflow-y-auto">
            <div className="mb-4 text-base font-semibold">Choose Language</div>
            <div className="space-y-2">
              {languages.map((lang) => {
                const flagCode = getFlagCode(lang.code);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2 text-left ${
                      selected === lang.code ? "border-accent bg-accent/10" : "border-border"
                    }`}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setSheetOpen(false);
                    }}
                  >
                    {flagCode && (
                      <img
                        src={`https://flagcdn.com/24x18/${flagCode.toLowerCase()}.png`}
                        alt=""
                        className="w-4 h-3 rounded-sm object-cover"
                        loading="lazy"
                      />
                    )}
                    <span className="text-sm font-medium">{lang.label}</span>
                  </button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div id="google_translate_element" className="sr-only" />
    </div>
  );
};

export default FloatingTranslate;
