import PocketBase from 'pocketbase';

const BASE_URL = 'http://localhost:8090';

export const client = new PocketBase(BASE_URL);
