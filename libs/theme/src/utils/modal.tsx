import { signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { Loader } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { ReactNode, Suspense } from 'react';

import { DialogProps, For } from '@storeo/core';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog';

type ModalType = Partial<DialogProps> & {
  id: string;
  title: string;
  children: ReactNode;
  preventOutsideClick?: boolean;
  description?: string;
  className?: string;
};

const modals = signal<ModalType[]>([]);

export const Modal = (props: Omit<ModalType, 'id'>) => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent
        className={props.className}
        onPointerDownOutside={
          props.preventOutsideClick ? e => e.preventDefault() : undefined
        }
      >
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
        </DialogHeader>
        <div className={'overflow-auto p-4'}>{props.children}</div>
      </DialogContent>
    </Dialog>
  );
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  useSignals();
  return (
    <>
      <For each={modals.value}>
        {dialog => (
          <Modal
            key={dialog.id}
            {...dialog}
            className={dialog.className}
            preventOutsideClick={true}
            open={true}
            setOpen={() => {
              modals.value = modals.value.filter(d => d.id !== dialog.id);
            }}
          >
            <Suspense
              fallback={
                <div className={`p-2`}>
                  <Loader className={'h-6 w-6 animate-spin'} />
                </div>
              }
            >
              {dialog.children}
            </Suspense>
          </Modal>
        )}
      </For>
      {children}
    </>
  );
};

type ShowModalParams = {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export function showModal(modal: ShowModalParams) {
  const uid = uuidv4();
  modals.value = [
    {
      ...modal,
      id: uid
    },
    ...modals.value
  ];

  return uid;
}

export function closeModal(id: string) {
  modals.value = modals.value.filter(d => d.id !== id);
}
