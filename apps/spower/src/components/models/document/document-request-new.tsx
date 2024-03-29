import { Dispatch, FC, SetStateAction } from 'react';

export type DocumentRequestNewProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DocumentRequestNew: FC<DocumentRequestNewProps> = ({
  open,
  setOpen
}) => {
  return <></>;
};
