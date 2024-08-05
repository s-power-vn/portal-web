import { InferType, number, object, string } from 'yup';

export const SearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

export type Search = InferType<typeof SearchSchema>;
