import React, { FC, ReactNode, useContext } from 'react';
import { User } from '@entur-partner/micro-frontend';
import { assertIsDefined } from '@entur-partner/util';

interface AppContextType {
  getToken: () => Promise<string>;
  user: User;
  logout?: () => void;
  activeOrgId: number;
}

export const AppContext = React.createContext<AppContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  let context = useContext(AppContext);
  assertIsDefined(context);
  return {
    logout: context.logout,
    getToken: context.getToken,
    user: context.user,
  };
};

export const useActiveOrgId = () => {
  let context = useContext(AppContext);
  assertIsDefined(context);
  return context.activeOrgId;
};

interface AppProviderProps {
  children: ReactNode;
  getToken: () => Promise<string>;
  user: User;
  organisationId: string;
}

export const AppProvider: FC<AppProviderProps> = ({
  children,
  organisationId,
  ...rest
}) => {
  return (
    <AppContext.Provider
      value={{ ...rest, activeOrgId: Number(organisationId) }}
    >
      {children}
    </AppContext.Provider>
  );
};
