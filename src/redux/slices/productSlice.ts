import { Product } from "@/interfaces";
import { apiServices } from "@/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllProduct = createAsyncThunk("products/getAllProduct", async () => {
    const { data } = await apiServices.getAllProducts();
    return data;
})
const initialState: { products: Product[] } = {
    products: []
};

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getAllProduct.fulfilled, (state, action) => {
            state.products = action.payload
            console.log("fulfilled", action.payload);
        }).addCase(getAllProduct.pending, () => {
            console.log("pending");
        }).addCase(getAllProduct.rejected, () => {
            console.log('rejected');
        })
    },
})
export const productReducer = productSlice.reducer;
