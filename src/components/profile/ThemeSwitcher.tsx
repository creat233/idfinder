
import * as React from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";
import { Sun, Moon } from "lucide-react";

const ThemeSwitcherSkeleton = () => (
    <div className="space-y-2">
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        <div className="h-[50px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
    </div>
);


export const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ThemeSwitcherSkeleton />;
  }
  
  const isDark = resolvedTheme === 'dark';

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{t('appTheme')}</Label>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="flex items-center space-x-2">
          <Sun className={`h-5 w-5 transition-all ${isDark ? 'text-muted-foreground' : 'text-yellow-500'}`} />
          <Moon className={`h-5 w-5 transition-all ${!isDark ? 'text-muted-foreground' : 'text-blue-300'}`} />
        </div>
        <Switch
          id="theme-toggle"
          checked={isDark}
          onCheckedChange={toggleTheme}
          aria-label="Toggle theme"
        />
      </div>
    </div>
  );
};
