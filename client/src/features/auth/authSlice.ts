import { createSlice } from "@reduxjs/toolkit";

export type Session = {
  [props: string]: string;
  role: string;
};

interface AuthInterface {
  isAuthorized: boolean;
  session: null | Session;
  isAuthorizig: boolean;
}

const initialState: AuthInterface = {
  isAuthorized: false,
  session: null,
  isAuthorizig: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login(state, { payload }) {
      state.session = payload.data;
      state.isAuthorized = true;
      state.isAuthorizig = false;
      localStorage.setItem("token", payload.token);
      localStorage.setItem("session", JSON.stringify(payload.data));
    },
    logout(state) {
      state.isAuthorized = false;
      state.session = null;
      localStorage.removeItem("token");
      localStorage.removeItem("session");
      window.location.reload();
    },
    setSession(state, { payload }) {
      state.isAuthorized = true;
      state.session = payload;
      state.isAuthorizig = false;
    },
    clearSession(state) {
      if (!localStorage.getItem("token") && !localStorage.getItem("session")) {
        state.isAuthorized = false;
        state.session = null;
        state.isAuthorizig = false;
      }
    },
    setIsAuthorizig(state, { payload }) {
      state.isAuthorizig = payload;
    },
  },

  selectors: {
    getSession(state) {
      return state.session;
    },
    getIsAuthorized(state) {
      return state.isAuthorized;
    },
    getAuthSlice(state) {
      return state;
    },
    getIsAuthorizig(state) {
      return state.isAuthorizig;
    },
  },
});

export const { logout, login, setSession, setIsAuthorizig, clearSession } =
  authSlice.actions;

export const { getSession, getIsAuthorized, getAuthSlice, getIsAuthorizig } =
  authSlice.selectors;

export default authSlice.reducer;
