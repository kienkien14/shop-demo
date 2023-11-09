import { createSlice } from '@reduxjs/toolkit';
import { findProductsAPI, getProductByIdAPI } from '../../../service/sim/product.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  products: [],
  product: null,
  search: {
    keyword: "",
    currentPage: 0,
    size: 10
  },
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setProducts(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.products = response.contents;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setProduct(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.product = response.contents;
    },
    setProductSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setProductSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getProducts() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { product } = getState();
    const resp = await findProductsAPI({ ...product.search, keyword: `${product.search.keyword}` });
    if (resp.code === '200') dispatch(slice.actions.setProducts(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getProduct(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getProductByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setProduct(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
