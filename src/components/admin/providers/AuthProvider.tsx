// src/components/providers/AuthProvider.tsx
'use client';

import { SessionProvider, useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { useAuthStore } from "@/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

function SessionSync({ initialSession }: { initialSession: Session | null }) {
  const { data: liveSession, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const activeToken = liveSession?.accessToken ?? initialSession?.accessToken ?? null;

    if (activeToken) {
      useAuthStore.getState().updateToken(activeToken);
      return;
    }

    useAuthStore.getState().logout();
  }, [initialSession?.accessToken, liveSession?.accessToken, status]);

  return null;
}

export default function AuthProvider({ children, session }: AuthProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }));

  return (
    <SessionProvider session={session}>
      <SessionSync initialSession={session} />
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}