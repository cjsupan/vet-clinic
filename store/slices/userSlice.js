// store/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";

const initialState = {
  data: null,
  loading: false,
  searching: false,
  searchData: [],
  selectedUser: [],
  modalView: false,
  modalView: false,
  modalView: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelected: (state, { payload } = action) => {
      state.loading = true;
      state.selectedUser = payload;
      state.loading = false;
    },
    toggle: (state, action) => {
      const { modalView, modalAdd, modalEdit } = action.payload;
      state.modalView = modalView;
      state.modalAdd = modalAdd;
      state.modalEdit = modalEdit;
    },
    fetchStart: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.data = action.payload.sort((a, b) => {
        const dateA = moment(a.Date_created, "lll");
        const dateB = moment(b.Date_created, "lll");
        return dateB - dateA;
      });
      state.loading = false;
    },
    fetchFailed: (state) => {
      state.loading = false;
    },
    createStart: (state) => {
      state.loading = true;
    },
    createSuccess: (state, action) => {
      state.data = [action.payload, ...state.data];
      state.loading = false;
    },
    createFailed: (state) => {
      state.loading = false;
    },
    updateStart: (state) => {
      state.loading = true;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
    },
    updateFailed: (state) => {
      state.loading = false;
    },
    deleteStart: (state) => {
      state.loading = true;
    },
    deleteSuccess: (state, action) => {
      state.data = state.data.filter((item) => item._id !== action.payload);
      state.loading = false;
    },
    deleteFailed: (state) => {
      state.loading = false;
    },
    searchStart: (state) => {
      state.searching = true;
      state.searchData = [];
    },
    searchUsers: (state, action) => {
      state.searchData = action.payload;
    },
    searchSuccess: (state) => {
      state.searching = false;
    },
    searchFailed: (state) => {
      state.searching = false;
      state.searchData = [];
    },
  },
});

export const {
  setSelected,
  fetchStart,
  fetchSuccess,
  fetchFailed,
  createStart,
  createSuccess,
  createFailed,
  updateStart,
  updateSuccess,
  updateFailed,
  deleteStart,
  deleteSuccess,
  deleteFailed,
  searchStart,
  searchUsers,
  searchSuccess,
  searchFailed,
  toggle,
} = userSlice.actions;

export const fetch = () => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await axios.get("http://localhost:3000/api/users");
    dispatch(fetchSuccess(response.data));
    return response;
  } catch (error) {
    dispatch(fetchFailed());
    console.log("error", error);
  }
};

export const create = (payload) => async (dispatch) => {
  dispatch(createStart());
  const date = moment().format("lll");
  try {
    payload.Date_created = date;
    payload.Date_updated = date;
    const response = await axios.post(
      "http://localhost:3000/api/users",
      payload
    );
    payload._id = response.data.insertedId;

    dispatch(createSuccess(payload));
    response.message = "Successfully Created!";
    return response;
  } catch (error) {
    dispatch(createFailed());
    console.log("error", error);
    return (error.message = "Creating user failed!");
  }
};

export const search = (searchTerm) => (dispatch, getState) => {
  dispatch(searchStart());
  const { data } = getState().user;

  try {
    const filteredData = data.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    dispatch(searchUsers(filteredData));
    dispatch(searchSuccess());
  } catch (error) {
    dispatch(searchFailed());
    // Handle error
  }
};

export const update = (data) => async (dispatch) => {
  dispatch(updateStart());
  const date = moment().format("lll");
  try {
    data.data.Date_updated = date;
    const response = await axios.patch(
      `http://localhost:3000/api/users/${data.Id}`,
      data.data
    );

    dispatch(updateSuccess(response.data));
    response.message = "Successfully Updated!";
    return response;
  } catch (error) {
    console.log(error);
    dispatch(updateFailed());
    return (error.message = "Updating user failed!");
  }
};

export const deleted = (userId) => async (dispatch) => {
  dispatch(deleteStart());
  try {
    const res = await axios.delete(`http://localhost:3000/api/users/${userId}`);
    dispatch(deleteSuccess(userId));
    return (res.message = "Successfully Deleted!");
  } catch (error) {
    dispatch(deleteFailed());
    console.log("error", error);
    return (error.message = "Deleting user failed!");
  }
};

export default userSlice.reducer;
