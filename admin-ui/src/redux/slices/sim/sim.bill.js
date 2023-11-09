import { createSlice } from '@reduxjs/toolkit';
import { findBillsAPI, getBillByIdAPI } from '../../../service/sim/bill.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  bills: [],
  bill: null,
  search: {
    keyword: "",
    currentPage: 0,
    size: 10
  },
};

const slice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.error = null
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setBills(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.bills = response.contents;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setBill(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.bill = response.contents;
    },
    setBillSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;
// Actions
export const { setBillSearch } = slice.actions
// ----------------------------------------------------------------------

export function getBills() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { bill } = getState()
    const resp = await findBillsAPI({ ...bill.search, keyword: `${bill.search.keyword}` });

    if (resp.code === '200')
      dispatch(slice.actions.setBills(resp));
    else
      dispatch(slice.actions.hasError(resp));
  };
}

export function getBill(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getBillByIdAPI(id);
    if (resp.code === '200')
      dispatch(slice.actions.setBill(resp));
    else
      dispatch(slice.actions.hasError(resp));
  };
}
