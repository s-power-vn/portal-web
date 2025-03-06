import PocketBase from 'pocketbase';

import { Collections, TypedPocketBase, UserResponse } from './generate/pb';

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const client = new PocketBase(BASE_URL) as TypedPocketBase;

export const getUser = (): UserResponse | undefined =>
  client.authStore.record
    ? (client.authStore.record as UserResponse)
    : undefined;

export const getImageUrl = (
  collection: Collections,
  id?: string,
  file?: string
): string => {
  return `${BASE_URL}/api/files/${collection}/${id}/${file}`;
};
