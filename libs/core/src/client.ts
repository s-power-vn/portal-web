import PocketBase from 'pocketbase';

import { TypedPocketBase } from './generate/pb';

const BASE_URL = 'http://localhost:8090';

export const client = new PocketBase(BASE_URL) as TypedPocketBase;
