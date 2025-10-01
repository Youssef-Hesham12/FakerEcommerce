import { configureStore } from "@reduxjs/toolkit";
import { counterReducer } from "./slices/counterSlice";
import { productReducer } from "./slices/productSlice";

// Store does not have a valid reducer.
export const store = configureStore({
    reducer: {
        // Add your reducers here
        // create slice and add reducer here
        counter: counterReducer,
        product: productReducer
    },
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch;