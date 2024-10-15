import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { roastError, errorMsg } from "@/helper/commonValues";

const attendanceInitialData = {
    check_in: '',
    check_out: '',
};


const initialState = {
    attendanceLoading: false,
    allAttendanceList: [],
    attendanceDialog: false,
    selectedAttendanceData: attendanceInitialData,
    deleteAttendanceDialog: false,
};

// Refactor checkINOutData to use createAsyncThunk
export const checkINOutData = createAsyncThunk(
    'attendance/addupdate',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/attendance/addupdate`, payload);
            const { data, msg, err } = response.data;

            if (err === 0) {
                return data;
            } else if (err === 1) {
                errorMsg(msg);
                return rejectWithValue(msg);
            }
        } catch (error) {
            roastError(error);
            return rejectWithValue(error.message);
        }
    }
);

export const getSingleData = createAsyncThunk(
    'attendance/getSingle',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/attendance/getSingle`, payload);
            const { data, msg, err } = response.data;

            if (err === 0) {
                return data;
            } else if (err === 1) {
                errorMsg(msg);
                return rejectWithValue(msg);
            }
        } catch (error) {
            roastError(error);
            return rejectWithValue(error.message);
        }
    }
);

export const attendanceSlice = createSlice({
    name: "attendance",
    initialState,
    reducers: {
        setAttendanceLoading: (state, action) => {
            state.attendanceLoading = action.payload;
        },
        setAllAttendanceList: (state, action) => {
            state.allAttendanceList = action.payload;
        },
        setAttendanceDialog: (state, action) => {
            state.attendanceDialog = action.payload;
        },
        setSelectedAttendanceData: (state, action) => {
            state.selectedAttendanceData = action.payload;
        },
        setDeleteAttendanceDialog: (state, action) => {
            state.deleteAttendanceDialog = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkINOutData.pending, (state) => {
                state.attendanceLoading = true;
            })
            .addCase(checkINOutData.fulfilled, (state, action) => {
                state.attendanceLoading = false;
                state.allAttendanceList = action.payload;
            })
            .addCase(checkINOutData.rejected, (state, action) => {
                state.attendanceLoading = false;
                console.error("Error: ", action.payload || action.error.message);
            })
            .addCase(getSingleData.pending, (state) => {
                state.attendanceLoading = true;
            })
            .addCase(getSingleData.fulfilled, (state, action) => {
                state.attendanceLoading = false;
                state.selectedAttendanceData = action.payload;
            })
            .addCase(getSingleData.rejected, (state, action) => {
                state.attendanceLoading = false;
                console.error("Error: ", action.payload || action.error.message);
            });
    },
});

export const {
    setAttendanceLoading,
    setAllAttendanceList,
    setAttendanceDialog,
    setSelectedAttendanceData,
    setDeleteAttendanceDialog,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
