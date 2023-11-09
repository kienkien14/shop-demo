import { createSlice } from '@reduxjs/toolkit';
import { getMediaUserByIdAPI, searchMediaUserAPI } from '../../../service/sim/user.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  users: [],
  user: null,
  search: {
    keyword: "",
    currentPage: 0,
    size: 10
  },
};

const slice = createSlice({
  name: 'mediaUser',
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
    setUsers(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.users = response.contents;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setUser(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.user = response.contents;

    },
    setMediaUserSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setMediaUserSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getMediaUsers() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { mediaUser } = getState();
    const resp = await searchMediaUserAPI({ ...mediaUser.search, keyword: `${mediaUser.search.keyword}` });
    if (resp.code === '200') dispatch(slice.actions.setUsers(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getMediaUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getMediaUserByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setUser(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
