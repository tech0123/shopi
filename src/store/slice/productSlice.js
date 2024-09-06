import { calcInitialValues } from '@/helper/commonValues'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
    selectedProducts: [],
    subTotal: 0,
    calcValues: calcInitialValues
}

export const productSlice = createSlice({
    name: 'productSliceName',
    initialState,
    reducers: {
        setSelectedProducts: (state, action) => {
            state.selectedProducts = action.payload
        },
        setSubTotal: (state, action) => {
            state.subTotal = action.payload
        },
        setCalcValues: (state, action) => {
            state.calcValues = action.payload
            console.log('setCalcValues', state.calcValues)
        },
    },

})


export const { setSelectedProducts, setCalcValues, setSubTotal } = productSlice.actions

export default productSlice.reducer