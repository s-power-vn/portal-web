import type { InferType } from 'yup';
import { number, object, string } from 'yup';

export const ListSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(20),
  filter: string().optional().default('')
});

export type ListParams = Partial<InferType<typeof ListSchema>>;
