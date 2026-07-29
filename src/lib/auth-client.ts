import { signOut, type SignOutParams } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";

function clearBrowserAuthCookies() {
  if (typeof document === "undefined") return;

  const cookiesToClear = ["refresh_token", "device_id"];
  cookiesToClear.forEach((name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  });
}

export async function syncAuthAccessToken(accessToken: string | null) {
  useAuthStore.getState().updateToken(accessToken);
}

export async function logoutUser(options?: SignOutParams) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (baseUrl) {
    try {
      await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.warn("Backend logout call failed:", error);
    }
  }

  clearBrowserAuthCookies();
  useAuthStore.getState().logout();

  await signOut({
    callbackUrl: "/admin/login",
    redirect: true,
    ...options,
  });
}
