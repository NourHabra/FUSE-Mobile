// slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  jwt: string | null;
}

const initialState: AuthState = {
  jwt: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setJwt: (state, action: PayloadAction<string>) => {
      state.jwt = action.payload;
    },
    clearJwt: (state) => {
      state.jwt = null;
    },
  },
});

export const { setJwt, clearJwt } = authSlice.actions;

export default authSlice.reducer;
