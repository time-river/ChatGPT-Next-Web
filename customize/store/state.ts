import { create } from 'zustand';

export interface StateStore {
  planVisible: boolean;
}

export const useStateStore = create<StateStore>(
  (set, get) => ({
    planVisible: false,
  })
);
