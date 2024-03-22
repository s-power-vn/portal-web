import { useParams } from '@tanstack/react-router';

import { FC } from 'react';

export type DocumentEditProps = {
  documentId: string;
};

export const DocumentEdit: FC<DocumentEditProps> = () => {
  return <h1>Document Edit</h1>;
};
