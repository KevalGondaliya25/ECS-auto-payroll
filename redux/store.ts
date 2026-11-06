import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { shopApi } from "./query/shop";
import { employeeApi } from "./query/employee";
import { repairOrderApi } from "./query/repairOrder";
import { paymentApi } from "./query/payment";

export const store = configureStore({
  reducer: {
    [shopApi.reducerPath]: shopApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [repairOrderApi.reducerPath]: repairOrderApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    })
      .concat(shopApi.middleware)
      .concat(paymentApi.middleware)
      .concat(employeeApi.middleware)
      .concat(repairOrderApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
