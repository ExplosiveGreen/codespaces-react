import { createSlice } from "@reduxjs/toolkit";

export const routesSlice = createSlice({
  name: "routes",
  initialState: {
    routes: [],
  },
  reducers: {
    addRoute: (state, action) => {
      const location = action.payload;
      state.routes = [...state.routes, location];
    },
    deleteRoute: (state, action) => {
      const location = action.payload;
      state.routes = state.routes.filter(
        (item) => item.lat !== location.lat && item.lng !== location.lng
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const { addRoute, deleteRoute } = routesSlice.actions;

export default routesSlice.reducer;
