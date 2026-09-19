import { Check, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { STORAGE_KEYS } from '@/lib/constants';

export const LOCALES = [
  { code: 'en-KE', label: 'English', native: 'English' },
  { code: 'sw-KE', label: 'Swahili', native: 'Kiswahili' },
] as const;

export type LocaleCode = (typeof LOCALES)[number]['code'];

/**
 * Language preference.
 *
 * The preference is stored and exposed now so the choice is durable, but the
 * interface strings are still English-only — translation catalogues are not
 * wired up yet, so Swahili is shown as coming soon rather than silently
 * doing nothing.
 */
export const LanguageSelector = ({ className }: { className?: string }) => {
  const [locale, setLocale] = useLocalStorage<LocaleCode>(
    STORAGE_KEYS.LANGUAGE as string,
    'en-KE'
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className} aria-label="Change language">
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LOCALES.map(({ code, native }) => {
          const unavailable = code !== 'en-KE';
          return (
            <DropdownMenuItem
              key={code}
              disabled={unavailable}
              onClick={() => !unavailable && setLocale(code)}
              className="flex items-center justify-between gap-2"
            >
              <span>{native}</span>
              {locale === code && <Check className="h-4 w-4 text-brand-600" />}
              {unavailable && <span className="text-[10px] text-neutral-400">Coming soon</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

LanguageSelector.displayName = 'LanguageSelector';
