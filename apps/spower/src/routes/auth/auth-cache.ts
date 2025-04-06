import { client2, restToken, userEmail, userId } from 'portal-core';

const AUTH_CACHE_DURATION = 5 * 60 * 1000;

export type AuthResult = {
  status: 'unauthorized' | 'not-registered' | 'authorized';
  email?: string;
  userId?: string;
  organizationId?: string;
};

let authCache: {
  result: AuthResult | null;
  timestamp: number;
} = {
  result: null,
  timestamp: 0
};

let isPageReloading = true;

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      isPageReloading = false;
    }, 100);
  });
}

export function shouldRefreshAuth(): boolean {
  return (
    !authCache.timestamp ||
    Date.now() - authCache.timestamp > AUTH_CACHE_DURATION
  );
}

export function forceRefreshAuth(): void {
  authCache = {
    result: null,
    timestamp: 0
  };
}

export async function performAuthentication(): Promise<AuthResult> {
  if (
    !isPageReloading &&
    authCache.timestamp &&
    Date.now() - authCache.timestamp < AUTH_CACHE_DURATION
  ) {
    return authCache.result!;
  }

  await client2.auth.authStateReady();

  if (!client2.auth.currentUser) {
    const result: AuthResult = { status: 'unauthorized' };
    authCache = {
      result,
      timestamp: Date.now()
    };
    return result;
  }

  const email = client2.auth.currentUser.email ?? '';
  userEmail.value = email;

  const isHasUser = await client2.api.checkUser();
  if (!isHasUser) {
    const result: AuthResult = { status: 'not-registered', email };
    authCache = {
      result,
      timestamp: Date.now()
    };
    return result;
  }

  const organizationId = localStorage.getItem('organizationId');
  const token = await client2.api.getRestToken(organizationId ?? undefined);

  restToken.value = token.token;
  userId.value = token.user_id;
  userEmail.value = email;

  const result: AuthResult = {
    status: 'authorized',
    email,
    userId: token.user_id,
    organizationId: organizationId ?? undefined
  };

  authCache = {
    result,
    timestamp: Date.now()
  };

  return result;
}

export async function enhancedWaitAuthenticated(): Promise<AuthResult> {
  return performAuthentication();
}

client2.auth.onAuthStateChanged(() => {
  forceRefreshAuth();
});
