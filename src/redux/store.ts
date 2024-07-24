// store.ts
import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./courseSlice";
import devotionsReducer from "./devotionsSlice";
import authReducer, { AuthState } from "./authSlice";
import { apiSlice } from "./api-slices/apiSlice";
import { SSLapi } from "./../services/SabbathSchoolApi";
import { CourseState } from "./courseSlice";
import DevotionsState from "./devotionsSlice";
import { videoLinksApi } from "../services/videoLinksApi";

export interface RootState {
  devotions: typeof DevotionsState;
  course: CourseState;
  auth: AuthState;
  [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>;
}

const store = configureStore({
  reducer: {
    course: courseReducer,
    devotions: devotionsReducer,
    auth: authReducer,
    [SSLapi.reducerPath]: SSLapi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [videoLinksApi.reducerPath]: videoLinksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      SSLapi.middleware,
      apiSlice.middleware,
      videoLinksApi.middleware
    ),
});

type AppDispatch = typeof store.dispatch;

export type { AppDispatch };

export default store;
