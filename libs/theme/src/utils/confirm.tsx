import { ReactNode, createContext, useContext, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../components/ui/alert-dialog';

type ConfirmContextValue = {
  show: (message: string, onConfirm?: () => void) => void;
};

const ConfirmContext = createContext<ConfirmContextValue>({
  show: () => {
    /**/
  }
});

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>();

  return (
    <ConfirmContext.Provider
      value={{
        show: (message, onConfirm) => {
          setMessage(message);
          setOnConfirm(prev => {
            if (onConfirm) {
              return onConfirm;
            }
            return prev;
          });
          setOpen(true);
        }
      }}
    >
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bỏ qua</AlertDialogCancel>
            <AlertDialogAction onClick={() => onConfirm?.()}>
              Chấp nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  return { confirm: context.show };
};
