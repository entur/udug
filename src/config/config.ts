import { createContext, useContext, useEffect, useState } from 'react';

export interface Config {
  timetableValidationApiUrl?: string;
}

export const ConfigContext = createContext<Config>({});

const getConfig = async (env: string): Promise<Config> => {
  const { default: config } = await import(`./environments/${env}.json`);
  return config;
};

export const useConfig = () => {
  const config = useContext(ConfigContext);
  return config;
};

export const useConfigProviderValue = (env: string) => {
  const [config, setConfig] = useState<Config>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      setConfig(await getConfig(env));
      setLoading(false);
    };
    fetchConfig();
  }, [env]);

  return {
    config,
    loading,
  };
};
