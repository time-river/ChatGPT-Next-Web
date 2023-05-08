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
        username: string,
        email: string,
    },
    token: string,
    isValid: boolean,

    isSignIn: () => boolean,
    updateToekn: (_:string) => void,
    signIn: (_: UserInfo) => void,
    signOut: () => void,
    setValid: (_: boolean) => void,
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
      updateToekn(token: string) {
        set(() => ({token}));
      },
      signIn({username, email, token}: UserInfo) {
        set(() => ({user: {username, email}, token}));
      },
      signOut() {
        localStorage.clear();
        window.location.href = "/signin";
      },
      setValid(valid: boolean) {
        set(() => ({ isValid: valid }));
      },
    }),
    {
      name: CheatpptStoreKey.User,
      version: 1,
    }
  )
)
