import { createSlice } from '@reduxjs/toolkit'

export const routesSlice = createSlice({
  name: 'routes',
  initialState: {
    routes:[]
  },
  reducers: {
    addRoute: (state, action) => {
        const {longitude,latitude} = action.payload;
        state.routes = [...state.routes, {longitude,latitude}];
    },
    deleteRoute: (state, action) => {
        const {longitude,latitude} = action.payload;
        state.routes = state.routes.filter(item => !item == {longitude,latitude});
    },
  },
})

// Action creators are generated for each case reducer function
export const { addRoute,deleteRoute } = routesSlice.actions

export default routesSlice.reducer