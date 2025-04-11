import { signal } from '@preact/signals-react';
import { PostgrestClient } from '@supabase/postgrest-js';
import { initializeApp } from 'firebase/app';
import {
  Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';

import { Database } from './generate/type';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const secretKey = 'xK9p2Lm7Qr3sT8vZ1wY6aB4cD0eF5gH';

const firebaseConfig = {
  apiKey: 'AIzaSyDgneYV3mdC6i0CMuOMTFoAaZ7-O7vDWg8',
  authDomain: 'storeo-3f145.firebaseapp.com',
  projectId: 'storeo-3f145',
  storageBucket: 'storeo-3f145.firebasestorage.app',
  messagingSenderId: '264240945494',
  appId: '1:264240945494:web:62a9191c33acdbd47d5ef7',
  measurementId: 'G-7VT22QZQJP'
};

export const restToken = signal<string | undefined>(undefined);
export const userId = signal<string | undefined>(undefined);
export const userEmail = signal<string | undefined>(undefined);

const xorEncodeQuery = (query: string, key: string): string => {
  let result = '';
  for (let i = 0; i < query.length; i++) {
    const charCode = query.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode ^ keyChar);
  }
  return Buffer.from(result).toString('base64');
};

class ApiClient {
  private readonly auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  }

  public async sendEmailOtp({ email }: { email: string }) {
    const response = await fetch(`${BASE_URL}/api/email-otp/send`, {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Không thể gửi mã OTP');
    }

    return response.json();
  }

  public async verifyEmailOtp({
    email,
    code
  }: {
    email: string;
    code: string;
  }) {
    const response = await fetch(`${BASE_URL}/api/email-otp/verify`, {
      method: 'POST',
      body: JSON.stringify({ email, code }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Không thể xác thực mã OTP');
    }

    return response.json();
  }

  public async registerUserInformation(user: {
    email: string;
    name: string;
    phone?: string;
    address?: string;
  }) {
    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(`${BASE_URL}/api/user/register`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Không thể đăng ký thông tin người dùng');
    }

    return response.json();
  }

  public async getRestToken(organizationId?: string) {
    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(`${BASE_URL}/api/user/rest-token`, {
      method: 'POST',
      body: JSON.stringify({ organization_id: organizationId }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Không thể lấy token');
    }

    const data: { token: string; user_id: string } = await response.json();

    return data;
  }

  public async emailRegister({
    email,
    password
  }: {
    email: string;
    password: string;
  }) {
    const response = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    if (!response.user) {
      throw new Error('Không thể đăng ký');
    }

    return response.user;
  }

  public async emailLogin({
    email,
    password
  }: {
    email: string;
    password: string;
  }) {
    const response = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    if (!response.user) {
      throw new Error('Không thể đăng nhập');
    }

    return response.user;
  }

  public async googleLogin() {
    const response = await signInWithPopup(this.auth, new GoogleAuthProvider());

    if (!response.user) {
      throw new Error('Không thể đăng nhập');
    }

    return response.user;
  }

  public async checkUser() {
    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(`${BASE_URL}/api/user/check`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return false;
    }

    return true;
  }
}

export class StoreoClient<T> {
  public readonly auth: Auth;
  public readonly rest: PostgrestClient<T>;
  public readonly api: ApiClient;

  constructor() {
    const firebaseApp = initializeApp(firebaseConfig);
    this.auth = getAuth(firebaseApp);
    this.rest = new PostgrestClient<T>(`${BASE_URL}/rest`, {
      fetch: async (input, init) => {
        let url: string;

        if (typeof input === 'string') {
          url = input;
        } else if (input instanceof Request) {
          url = input.url;
        } else {
          url = input.toString();
        }

        console.log('url', url);

        const urlObj = new URL(url);
        if (urlObj.search) {
          const query = urlObj.search.substring(1);
          const encodedQuery = xorEncodeQuery(query, secretKey);
          urlObj.search = `?${encodedQuery}`;

          if (typeof input === 'string') {
            input = urlObj.toString();
          } else if (input instanceof Request) {
            input = new Request(urlObj.toString(), input);
          } else {
            input = urlObj.toString() as any;
          }
        }

        if (!restToken.value) {
          throw new Error('Không có token');
        }

        const response = await fetch(input, {
          ...init,
          headers: {
            ...init?.headers,
            Authorization: `Bearer ${restToken.value}`
          }
        });

        return response;
      }
    });
    this.api = new ApiClient(this.auth);
  }
}

export const client2 = new StoreoClient<Database>();
