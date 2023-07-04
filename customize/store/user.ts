"user client";

import { createStore } from 'zustand/vanilla'
import { persist } from "zustand/middleware";
import { CheatpptStoreKey } from './constant';

export interface UserInfo {
  username: string;
  email: string;
  token: string;
}

export interface UserStore {
    user: {
        username: string;
        email: string;
    };
    token: string;
    isValid: boolean;

    isSignIn: () => boolean;
    signIn: (_: UserInfo) => void;
    signOut: () => void;
}

export const useUser = createStore<UserStore>()(
  persist(
    (set, get) => ({
      user: {
        username: "",
        email: "",
      },
      token: "",
      isValid: false,

      isSignIn(): boolean {
        return this.isValid;
      },
      signIn({username, email, token}: UserInfo) {
        set(() => ({user: {username, email}, token, isValid: true}));
      },
      signOut() {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "/signin";
      },
    }),
    {
      name: CheatpptStoreKey.User,
      version: 1,
    }
  )
)

export function getToken() {
  return useUser.getState().token
}