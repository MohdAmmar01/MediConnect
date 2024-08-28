import { createSlice } from "@reduxjs/toolkit"

const UserSlice = createSlice({
  name: 'users',
  initialState: {
    isloggedin: false,
    userdata: null,
  },
  reducers: {

    setdata(state, action) {
      state.userdata = action.payload
    },
    setisLoggedin(state, action) {
      state.isloggedin = action.payload
    },

  },
})


export default UserSlice.reducer
export const { setdata, setisLoggedin } = UserSlice.actions
