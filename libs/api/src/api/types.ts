import type { InferType } from 'yup';
import { number, object, string } from 'yup';

export const SearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(15),
  filter: string().optional().default('')
});

export type Search = InferType<typeof SearchSchema>;
