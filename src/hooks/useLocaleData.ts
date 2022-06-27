import { useEffect, useState } from 'react';

export const useLocaleData = (locale: string) => {
  const [state, setState] = useState<Record<string, string>>({});
  useEffect(() => {
    const fetchLocaleData = async () => {
      const { default: localeData } = await import(
        `../../compiled-lang/${locale}.json`
      );
      setState(localeData);
    };
    fetchLocaleData();
  }, [locale]);

  return state;
};
