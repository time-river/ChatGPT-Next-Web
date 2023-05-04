"user client";

import { createStore } from 'zustand/vanilla'
import { persist } from "zustand/middleware";
import { CheatpptStoreKey } from './constant';

export interface UserInfo {
  username: string,
  email: string,
  token: string,
}

export interface UserStore {
    user: {
        username: string,
        email: string,
    },
    token: string,

    isSignIn: () => boolean,
    updateToekn: (_:string) => void,
    signIn: (_: UserInfo) => void,
    signOut: () => void,
}

export const useUser = createStore<UserStore>()(
  persist(
    (set, get) => ({
      user: {
        username: "",
        email: "",
      },
      token: "",

      isSignIn(): boolean {
        return this.user.username !== "" && this.user.email !== "" && this.token !== "";
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
      }
    }),
    {
      name: CheatpptStoreKey.User,
      version: 1,
    }
  )
)
