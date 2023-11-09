import { createSlice } from '@reduxjs/toolkit';
import { findCategoriesAPI, getCategoryByIdAPI } from '../../../service/sim/category.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  categories: [],
  category: null,
  search: {
    keyword: "",
    currentPage: 0,
    size: 10
  },
};

const slice = createSlice({
  name: 'category',
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
    setCategories(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.categories = response.contents;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setCategory(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.category = response.contents;
    },
    setCategorySearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setCategorySearch } = slice.actions;
// ----------------------------------------------------------------------

export function getCategories() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { category } = getState();

    const resp = await findCategoriesAPI({
      ...category.search,
      keyword: `${category.search.keyword}`,
    });

    if (resp.code === '200') dispatch(slice.actions.setCategories(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getCategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getCategoryByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setCategory(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
