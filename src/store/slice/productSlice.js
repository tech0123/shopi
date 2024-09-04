import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
    selectedProducts: [],
}

export const productSlice = createSlice({
    name: 'productSliceName',
    initialState,
    reducers: {
        setSelectedProducts: (state, action) => {
            state.selectedProducts = action.payload
        },
    },

})


export const { setSelectedProducts } = productSlice.actions

export default productSlice.reducer