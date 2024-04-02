import { Dispatch, SetStateAction } from 'react';

export type DialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export type DialogWithoutOpenProps = Omit<DialogProps, 'open'>;
