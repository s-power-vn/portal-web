import { signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { v4 as uuidv4 } from 'uuid';

import { ReactNode } from 'react';

import { DialogProps, For } from '@storeo/core';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog';

type ModalType = Partial<DialogProps> & {
  id: string;
  title: string;
  children: ReactNode;
  preventOutsideClick?: boolean;
  description?: string;
};

const modals = signal<ModalType[]>([]);

export const Modal = (props: Omit<ModalType, 'id'>) => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent
        onPointerDownOutside={
          props.preventOutsideClick ? e => e.preventDefault() : undefined
        }
      >
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription className={'italic'}>
            {props.description}
          </DialogDescription>
        </DialogHeader>
        {props.children}
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
            {...dialog}
            preventOutsideClick={true}
            open={true}
            setOpen={() => {
              modals.value = modals.value.filter(d => d.id !== dialog.id);
            }}
          >
            {dialog.children}
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

  return () => {
    modals.value = modals.value.filter(d => d.id !== uid);
  };
}
