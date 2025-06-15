
import * as React from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";
import { Sun, Moon } from "lucide-react";

export const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  if (!mounted) {
    // Render a placeholder or nothing on the server to avoid hydration mismatch
    return <div className="h-[76px]"></div>;
  }

  return (
    <div>
      <Label className="block text-sm font-medium mb-1">{t('appTheme')}</Label>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center space-x-2">
          <Sun className="h-[1.2rem] w-[1.2rem]" />
          <Label htmlFor="theme-toggle" className="text-sm font-medium cursor-pointer">
            {t('lightMode')} / {t('darkMode')}
          </Label>
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        </div>
        <Switch
          id="theme-toggle"
          checked={isDark}
          onCheckedChange={toggleTheme}
        />
      </div>
    </div>
  );
};
