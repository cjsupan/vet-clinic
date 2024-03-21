// store/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";
import { publicRuntimeConfig } from "../../next.config";
const { API_URL } = publicRuntimeConfig;

const initialState = {
  data: null,
  loading: false,
  searching: false,
  searchData: [],
  selectedAppointment: [],
  selectedClient: {},
  modalView: false,
  modalAdd: false,
  modalEdit: false,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setSelected: (state, { payload } = action) => {
      state.selectedAppointment = payload;
    },
    setClient: (state, { payload } = action) => {
      state.selectedClient = payload;
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
      state.data = action.payload;
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
    searchAppointment: (state, action) => {
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
  setClient,
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
  searchAppointment,
  searchSuccess,
  searchFailed,
  toggle,
} = appointmentSlice.actions;

export const fetch = () => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await axios.get(`${API_URL}/api/appointments`);

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

    const response = await axios.post(`${API_URL}/api/appointments`, payload);
    payload._id = response.data.insertedId;

    dispatch(createSuccess(payload));
    response.message = "Successfully Created!";
    return response;
  } catch (error) {
    dispatch(createFailed());
    console.log("error", error);
    return (error.message = "Creating appointment failed!");
  }
};

export const search = (searchTerm) => (dispatch, getState) => {
  dispatch(searchStart());
  const { data } = getState().user;

  try {
    const filteredData = data.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    dispatch(searchAppointment(filteredData));
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
    data.data.date_updated = date;

    const response = await axios.patch(
      `${API_URL}/api/appointments/${data.Id}`,
      data.data
    );
    dispatch(updateSuccess());
    response.message = "Successfully Updated!";
    return response;
  } catch (error) {
    dispatch(updateFailed());
    console.log("error", error);
    return (error.message = "Updating appointments failed!");
  }
};

export const deleted = (appointmentId) => async (dispatch) => {
  dispatch(deleteStart());
  try {
    const response = await axios.delete(
      `${API_URL}/api/appointments/${appointmentId}`
    );
    dispatch(deleteSuccess(appointmentId));
    response.message = "Successfully Deleted!";
    return response;
  } catch (error) {
    dispatch(deleteFailed());
    console.log("error", error);
    return (error.message = "Deleting appointment failed!");
  }
};

export default appointmentSlice.reducer;
