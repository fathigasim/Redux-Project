import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
  lang: string;
}

const initialState: LanguageState = {
  lang: localStorage.getItem("lang") || "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.lang = action.payload;
      localStorage.setItem("lang", action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
