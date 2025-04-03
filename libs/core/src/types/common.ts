/**
 * Type for pagination parameters
 */
export type PaginationParams = {
  pageIndex?: number;
  pageSize?: number;
  filter?: string;
};

/**
 * Generic type for paginated response
 */
export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};

/**
 * Generic type for API input
 */
export type EntityInput<T> = Partial<T>;

/**
 * Generic type for API update input
 */
export type EntityUpdateInput<T> = EntityInput<T> & {
  id: string;
};
