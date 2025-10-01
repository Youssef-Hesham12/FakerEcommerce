import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    count: 10
}

const counterSlice = createSlice({
    name: "counter",
    initialState,
    // reducer -> function
    reducers: {
        increment: (state) => {
            state.count += 1
        },
        decrement: (state) => {
            state.count -= 1
        },
        incrementByNum(state, action) {
            state.count += action.payload // pass number and += count
        }
    }
})

export const counterReducer = counterSlice.reducer
// const x = counterSlice.actions // contain increment and decrement
export const { increment, decrement, incrementByNum } = counterSlice.actions; // action creator must invoke to action
