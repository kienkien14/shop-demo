import { createSlice } from '@reduxjs/toolkit';
import { findMediaRolesAPI, getMediaRoleByIdAPI } from '../../../service/sim/role.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  roles: [],
  role: null,
  search: {
    keyword: "",
    currentPage: 0,
    size: 10
  },
};

const slice = createSlice({
  name: 'mediaRole',
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
    setRoles(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.roles = response.contents;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setRole(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.roles = response.contents;
    },
    setMediaRoleSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setMediaRoleSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getMediaRoles() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { mediaRole } = getState();
    const resp = await findMediaRolesAPI({ ...mediaRole.search, keyword: `${mediaRole.search.keyword}` });

    if (resp.code === '200') dispatch(slice.actions.setRoles(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getMediaRole(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getMediaRoleByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setRole(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
