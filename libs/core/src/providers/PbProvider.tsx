import PocketBase from 'pocketbase';

import { ReactNode, createContext, useContext } from 'react';

type PbProviderProps = {
  endpoint: string;
  children: ReactNode;
};

const PbContext = createContext<PocketBase | undefined>(undefined);

export function usePb() {
  const ctx = useContext(PbContext);

  if (!ctx) {
    throw new Error('usePb must be used within a PbProvider');
  }

  return ctx;
}

export const PbProvider = (props: PbProviderProps) => {
  const pb = new PocketBase(props.endpoint);
  return <PbContext.Provider value={pb}>{props.children}</PbContext.Provider>;
};
