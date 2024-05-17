import { Loader2 } from 'lucide-react';

import { ReactNode, createContext, useContext, useState } from 'react';

import { cn } from '@storeo/core';

import { AlertDialog, AlertDialogContent } from '../components/ui/alert-dialog';

type LoadingContext = {
  showLoading: () => void;
  hideLoading: () => void;
};

const LoadingContext = createContext<LoadingContext>({
  showLoading: () => {
    /**/
  },
  hideLoading: () => {
    /**/
  }
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <LoadingContext.Provider
      value={{
        showLoading: () => setOpen(true),
        hideLoading: () => setOpen(false)
      }}
    >
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent
          className={'flex h-12 w-12 items-center justify-center p-0'}
        >
          <Loader2
            className={cn('text-primary/60 my-1 h-6 w-6 animate-spin')}
          />
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  return useContext(LoadingContext);
};
