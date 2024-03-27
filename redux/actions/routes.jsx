import { createSlice } from "@reduxjs/toolkit";

export const routesSlice = createSlice({
  name: "routes",
  initialState: {
    routes: [],
  },
  reducers: {
    addRoute: (state, action) => {
      console.log()
      const location = action.payload;
      const temp = [...state.routes];
      temp.splice(Math.round(state.routes.length/2),0,location);
      state.routes = temp;
    },
    deleteRoute: (state, action) => {
      const location = action.payload;
      let flag = false;
      state.routes = state.routes.filter(
        (item) => {
          if(!flag) {
            flag = true;
            return (item.lat !== location.lat && item.lng !== location.lng)
           }
           return true 
        });
    },
  },
});

// Action creators are generated for each case reducer function
export const { addRoute, deleteRoute } = routesSlice.actions;

export default routesSlice.reducer;
