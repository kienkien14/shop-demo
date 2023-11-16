import { createSlice } from '@reduxjs/toolkit';
import { findBillItemsAPI, getBillItemByIdAPI } from '../../../service/sim/billItem.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  billItems: [],
  billItem: null,
  search: {
    keyword: "",
    currentPage: 0,
    size: 10
  },
};

const slice = createSlice({
  name: 'billItem',
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
    setBillItems(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.billItems = response.contents;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setBillItem(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.billItem = response.contents;
    },
    setBillItemSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;
// Actions
export const { setBillItemSearch } = slice.actions
// ----------------------------------------------------------------------

export function getBillItems() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { billItem } = getState()
    const resp = await findBillItemsAPI({ ...billItem.search, keyword: `${billItem.search.keyword}` });
    if (resp.code === '200')
      dispatch(slice.actions.setBillItems(resp));
    else
      dispatch(slice.actions.hasError(resp));
  };
}

export function getBillItem(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getBillItemByIdAPI(id);
    if (resp.code === '200')
      dispatch(slice.actions.setBillItem(resp));
    else
      dispatch(slice.actions.hasError(resp));
  };
}
