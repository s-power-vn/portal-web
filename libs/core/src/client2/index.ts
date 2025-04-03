import { PostgrestClient } from '@supabase/postgrest-js';
import { initializeApp } from 'firebase/app';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth';

import { Database } from './generate/type';

export const BASE_URL = import.meta.env.VITE_BASE_URL;

const firebaseConfig = {
  apiKey: 'AIzaSyDgneYV3mdC6i0CMuOMTFoAaZ7-O7vDWg8',
  authDomain: 'storeo-3f145.firebaseapp.com',
  projectId: 'storeo-3f145',
  storageBucket: 'storeo-3f145.firebasestorage.app',
  messagingSenderId: '264240945494',
  appId: '1:264240945494:web:62a9191c33acdbd47d5ef7',
  measurementId: 'G-7VT22QZQJP'
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

  public async getRestToken({ organization_id }: { organization_id?: string }) {
    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(`${BASE_URL}/api/user/rest-token`, {
      method: 'POST',
      body: JSON.stringify({ organization_id }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Không thể lấy token');
    }

    const data = await response.json();

    localStorage.setItem('restToken', data.token);
    localStorage.setItem('userId', data.user_id);

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

  public async checkUser() {
    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(`${BASE_URL}/api/user/check`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Không thể kiểm tra người dùng');
    }

    return response.json();
  }
}

export class StoreoClient {
  public readonly auth: Auth;
  public readonly rest: PostgrestClient<Database>;
  public readonly api: ApiClient;

  constructor() {
    const firebaseApp = initializeApp(firebaseConfig);
    this.auth = getAuth(firebaseApp);
    this.rest = new PostgrestClient<Database>(`http://localhost:3000`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('restToken')}`
      }
    });
    this.api = new ApiClient(this.auth);
  }
}

export const client2 = new StoreoClient();
