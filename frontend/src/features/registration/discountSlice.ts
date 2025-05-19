import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { discountService } from '../../services/api';

// Async thunk to validate discount code
export const validateDiscountCode = createAsyncThunk(
  'discount/validateDiscountCode',
  async (code: string, { rejectWithValue }) => {
    try {
      return await discountService.validateDiscountCode(code);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface DiscountState {
  code: string;
  isValidating: boolean;
  appliedDiscount: {
    code: string;
    discount: number;
    description: string;
  } | null;
  error: string | null;
}

const initialState: DiscountState = {
  code: '',
  isValidating: false,
  appliedDiscount: null,
  error: null,
};

export const discountSlice = createSlice({
  name: 'discount',
  initialState,
  reducers: {
    setDiscountCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
      state.error = null;
    },
    removeDiscount: (state) => {
      state.appliedDiscount = null;
    },
    resetDiscount: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateDiscountCode.pending, (state) => {
        state.isValidating = true;
        state.error = null;
      })
      .addCase(validateDiscountCode.fulfilled, (state, action) => {
        state.isValidating = false;
        state.appliedDiscount = action.payload;
        state.code = '';
        state.error = null;
      })
      .addCase(validateDiscountCode.rejected, (state, action) => {
        state.isValidating = false;
        state.error = action.payload as string;
      });
  },
});

export const { setDiscountCode, removeDiscount, resetDiscount } = discountSlice.actions;

export const selectDiscountCode = (state: RootState) => state.discount.code;
export const selectIsValidating = (state: RootState) => state.discount.isValidating;
export const selectAppliedDiscount = (state: RootState) => state.discount.appliedDiscount;
export const selectDiscountError = (state: RootState) => state.discount.error;

export default discountSlice.reducer;