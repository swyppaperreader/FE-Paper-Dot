import { create } from "zustand";

interface LoginState {
  login: boolean;
  userInfo: {
    userId?: string;
    profileImageUrl: string;
    nickname: string;
    email?: string;
  } | null;

  setLogin: (login: boolean) => void;
  setUserInfo: (userInfo: {
    userId?: string;
    profileImageUrl: string;
    nickname: string;
    email?: string;
  }) => void;
  clearUserInfo: () => void;
}

export const useLoginStore = create<LoginState>((set) => ({
  login: false,
  userInfo: null,
  clearUserInfo: () => set({ userInfo: null, login: false }),
  setUserInfo: (userInfo: {
    userId?: string;
    profileImageUrl: string;
    nickname: string;
    email?: string;
  }) => set({ userInfo }),
  setLogin: (login) => set({ login }),
}));

interface AccessTokenState {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}
export const useAccessTokenStore = create<AccessTokenState>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken: string | null) => set({ accessToken }),
}));
